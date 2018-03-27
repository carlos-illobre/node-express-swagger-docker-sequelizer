const express = require('express');

module.exports = express
.Router({mergeParams: true})
.get('/v1/points', (req, res, next) => {

    req.db.CustomPoint.findAll({
        attributes: ['id', 'name', 'points', 'values', 'group']
    })
    .then((points) => {
        return points.map((point) => {
            point.values = JSON.parse(point.values);
            return point;
        });
    })
    .then((points) => {

        res.send({
            points: points,
        });

    })
    .catch(next);

});
