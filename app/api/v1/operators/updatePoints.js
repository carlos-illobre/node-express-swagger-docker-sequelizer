const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/operators/me/points', authJwt, (req, res, next) => {
    const bodyPoints = req.body;
    // Look for the specified event
    return req.db.OperatorCustomPoint.findAll({
        where: {
            custom_point_id: {
                [req.db.Sequelize.Op.in]: bodyPoints.map((point) => point.id)
            },
            operator_id: req.user.id
        }
    })
    .then((points) => { // TODO: Determine operators for points.
        return Promise.all([
            points,
            req.db.OperatorCustomPoint.destroy({ // Destroy all previous points.
                force: true,
                where: {
                    operator_id: req.user.id
                }
            }),
        ]);
    })
    .then(([points]) => { // Compose object for bulkCreate rules.
        return points.map((point) => {
            const current = bodyPoints.find((_point) => _point.id == point.id);
            return {
                custom_point_id: current.id,
                points: current.points,
                group: current.group,
                values: JSON.stringify(current.values),
                operator_id: req.user.id
            };
        });
    })
    .then((points) => req.db.OperatorCustomPoint.bulkCreate(points))
    .then((points) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
