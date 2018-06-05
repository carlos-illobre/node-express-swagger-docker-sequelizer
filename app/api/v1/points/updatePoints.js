const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/points', authJwt, (req, res, next) => {
    // if (req.user.role != 'Admin') {
    //     const error = new Error('This is an Administrator only resource.');
    //     error.status = 401;
    //     throw error;
    // }
    const bodyPoints = req.body;
    req.db.CustomPoint.findAll({
        where: {
            id: {
                [req.db.Sequelize.Op.in]: bodyPoints.map((point) => point.id)
            }
        }
    })
    .then((points) => {
        return points.map((point) => {
            const current = bodyPoints.find((_rule) => _rule.id === point.id);
            point.name = current.name;
            point.values = JSON.stringify(current.values);
            point.points = current.points;
            point.group = current.group;
            return point.save();
        });
    })
    .then((points) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
