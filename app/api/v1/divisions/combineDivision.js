const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.patch('/v1/divisions/:id/combine/:target', authJwt, async (req, res, next) => {
    try {
        const [origin, target] = await Promise.all([
            req.db.Division.findOne({
                where: {
                    id: req.params.id
                }
            }),
            req.db.Division.findOne({
                where: {
                    id: req.params.target
                }
            })
        ]);

        if (origin.event_id !== target.event_id) {
            const error = new Error('The target division does not belong to the same event.');
            error.status = 422;
            throw error;
        }

        const teams = await req.db.DivisionTeam.findAll({
            where: {
                division_id: req.params.id
            }
        });

        const [teamsArray] = await Promise.all([
            teams.map((team) => {
                return {
                    division_id: req.params.target,
                    team_id: team.team_id
                };
            }),
            req.db.DivisionTeam.destroy({
                where: {
                    division_id: req.params.id
                },
                force: true
            }),
            req.db.Division.destroy({
                where: {
                    id: req.params.id
                },
                force: true
            })
        ]);

        await req.db.DivisionTeam.bulkCreate(teamsArray);
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
});
