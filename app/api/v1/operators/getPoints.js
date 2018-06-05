const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.get('/v1/operators/me/points', authJwt, (req, res, next) => {

    req.db.OperatorCustomPoint.findAll({
        attributes: ['custom_point_id', 'points', 'values', 'group'],
        where: {
            operator_id: req.user.id
        }
    })
    .then((points) => {
        return points.map((point) => {
            return {
                id: point.custom_point_id,
                points: point.points,
                values: JSON.parse(point.values),
                group: point.group
            };
        });
    })
    .then((points) => {

        res.send({
            points: points,
        });

    })
    .catch(next);

});
