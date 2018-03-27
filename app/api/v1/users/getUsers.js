const express = require('express');
const halson = require('halson');
const _ = require('lodash');
const Op = require('sequelize').Op;

module.exports = express
.Router({mergeParams: true})
.get('/v1/users', async (req, res, next) => {

    try {
    
        const where = {};
        const order = [];
        const limit = isNaN(req.query.limit) ? 10 : parseInt(req.query.limit);

        if (req.query.search) {
            where[Op.or] = [{
                first_name: {
                    [Op.like]: `%${req.query.search}%`,
                },
            }, {
                last_name: {
                    [Op.like]: `%${req.query.search}%`,
                },
            }, {
                email: {
                    [Op.like]: `%${req.query.search}%`,
                },
            }, {
                phone: {
                    [Op.like]: `%${req.query.search}%`,
                },
            }];
        }

        if (req.query.sort) {
            if (req.query.sort[0] == '-') {
                order.push([req.query.sort.substring(1), 'desc']);
            } else {
                order.push([req.query.sort]);
            }
        }

        const attributes = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
        ];

        const result = await req.db.User.findAndCountAll({
            attributes,
            include: [{
                model: req.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
            where,
            order,
            limit,
            offset: req.query.page && (req.query.page - 1) * limit,
        });

        const response = result.rows.map(user => {
            return halson({
                ...(_.pick(user, attributes)),
                roles: user.roles.map(role => ({
                    name: role.name,
                })),
            })
            .addLink('self', `${req.base}${req.originalUrl.replace(/\?.*$/, '')}/${user.id}`);
        });

        res.json({
            users: response,
            page: !req.query.page || req.query.page < 0 ? 1 : req.query.page,
            count: Math.ceil(result.count / limit),
        });

    } catch(error) {
        next(error);
    }

});
