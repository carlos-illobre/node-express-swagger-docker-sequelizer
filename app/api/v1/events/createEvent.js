const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);
const halson = require('halson');
const _ = require('lodash');
const Op = require('sequelize').Op;
const validate = require('express-validation');
const requestSchema = require('./createEventRequestSchema.js');

const findOrCreate = async ({
    Model,
    key,
    items,
    transformItemBeforeCreate,
    transaction,
}) => {
    const foundItems = await Model.findAll({
        where: {
            [key]: {
                [Op.in]: items.map(item => item[key]),
            }
        }
    });
    const map = foundItems.reduce((prev, item) => prev.set(item[key], item), new Map());
    const newItems = await Promise.all(
        items
        .filter(item => !map.has(item[key]))
        .map(item => Model.create(transformItemBeforeCreate(item), { transaction }))
    );
    return newItems.reduce((prev, item) => prev.set(item[key], item), map);
};

module.exports = express
.Router({mergeParams: true})
.post('/v1/events', authJwt, validate(requestSchema), async (req, res, next) => {

    req.body.teams = req.body.teams || [];
    req.body.divisions = req.body.divisions || [];
    req.body.coaches = req.body.coaches || [];
    req.body.facilities = req.body.facilities || [];

    const transaction = await req.db.sequelize.transaction();

    try {

        const coachesMap = await findOrCreate({
            Model: req.db.Coach,
            key: 'external_coach_id',
            items: req.body.coaches,
            transformItemBeforeCreate: coach => coach,
            transaction,
        });

        const divisions = await Promise.all(
            req.body.divisions.map(
                division => req.db.Division.create(
                    {
                        ...(_.omit(division, ['teams', 'gender'])),
                        gender_id: division.gender.id,
                    }, {
                        transaction,
                    }
                )
            )
        );

        const teamsMap = await findOrCreate({
            Model: req.db.Team,
            key: 'external_team_id',
            items: req.body.teams,
            transaction,
            transformItemBeforeCreate: team => {
                if (!coachesMap.has(team.external_coach_id)) {
                    const error = new Error(`The coach with external_coach_id '${team.external_coach_id}' into the team '${team.name}' does not exist.`);
                    error.status = 400;
                    throw error;
                }
                return {
                    external_team_id: team.external_team_id,
                    name: team.name,
                    coach_id: coachesMap.get(team.external_coach_id).id,
                };
            },
        });

        const divisionsTeamsIds = req.body.divisions.map(
            division => _(division.teams)
            .map(team => team.external_team_id)
            .map(external_team_id => {
                if (!teamsMap.has(external_team_id)) {
                    const error = new Error(`The team with external_team_id '${external_team_id}' into the division '${division.name}' does not exist.`);
                    error.status = 400;
                    throw error;
                }
                return teamsMap.get(external_team_id).id;
            })
            .value()
        );

        await Promise.all(
            divisions.map(
                (division, index) => division.addTeams(divisionsTeamsIds[index], { transaction })
            )
        );

        const statesMap = await findOrCreate({
            Model: req.db.State,
            key: 'abbreviation',
            items: req.body.facilities.map(facility => facility.state),
            transformItemBeforeCreate: state => state,
            transaction,
        });

        const facilities = await Promise.all(
            req.body.facilities.map(facility => req.db.Facility.create({
                name: facility.name,
                abbreviation: facility.abbreviation,
                street: facility.street,
                city: facility.city,
                zip: facility.zip,
                mapUrl: facility.map.url,
                state_id: statesMap.get(facility.state.abbreviation).id,
            }, { transaction }))
        );

        const event = await req.db.Event.create({
            sport_id: req.body.sport.id,
            name: req.body.name,
            start_date: req.body.dates.start,
            end_date: req.body.dates.end,
            image_url: req.body.image.url,
            operator_id: req.user.id,
        }, { transaction });

        await event.addTeams(
            [...teamsMap.values()],
            { transaction }
        );
        await event.addFacilities(facilities, { transaction });
        await event.addDivisions(divisions, { transaction });

        const location = `${req.base}/api/v1/events/${event.id}`;
        res.setHeader('Location', location);
        res.status(201).json(
            halson({
                id: event.id
            })
            .addLink('self', location)
        );

        transaction.commit();

    } catch(error) {
        transaction.rollback();
        next(error);
    }

});
