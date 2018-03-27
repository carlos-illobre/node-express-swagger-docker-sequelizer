const express = require('express');
const halson = require('halson');
const Op = require('sequelize').Op;
const _ = require('lodash');

module.exports = express
.Router({mergeParams: true})
.get('/v1/events', async (req, res, next) => {

    try {
        
        const where = {};
        const order = [];

        if (req.query.search) {
            where[Op.or] = [{
                name: {
                    [Op.regexp]: req.query.search,
                },
            }, {
                location: {
                    [Op.regexp]: req.query.search,
                },
            }];
        }

        if (req.query.max_start_date) {
            where.start_date = where.start_date || {};
            where.start_date[Op.lte] = new Date(req.query.max_start_date);
        }

        if (req.query.min_start_date) {
            where.start_date = where.start_date || {};
            where.start_date[Op.gte] = new Date(req.query.min_start_date);
        }

        if (req.query.sort) {
            if (req.query.sort[0] == '-') {
                order.push([req.query.sort.substring(1), 'desc']);
            } else {
                order.push([req.query.sort]);
            }
        }

        const limit = 10;

        const result = await req.db.Event.findAndCountAll({
            attributes: [
                'id',
                'name',
                'image_url',
                'location',
                'start_date',
                'end_date',
            ],
            include: [{
                model: req.db.Team,
                as: 'teams',
                attributes: ['id'],
            }, {
                model: req.db.Division,
                as: 'divisions',
                attributes: ['id'],
            }],
            where,
            order,
            limit,
            offset: req.query.page && (req.query.page - 1) * 10,
        });

        const response = result.rows.map(event => {
            return halson({
                ...(_.pick(event, [
                    'id',
                    'name',
                    'image_url',
                    'location',
                    'start_date',
                    'end_date',
                ])),
                teams: {
                    count: event.teams.length,
                },
                divisions: {
                    count: event.divisions.length,
                },
            })
            .addLink('self', `${req.base}${req.originalUrl.replace(/\?.*$/, '')}/${event.id}`);
        });

        res.json({
            events: response,
            page: !req.query.page || req.query.page < 0 ? 1 : req.query.page,
            count: Math.ceil(result.count / limit),
        });

    } catch(error) {
        next(error);
    }

});
