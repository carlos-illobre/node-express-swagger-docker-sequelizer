const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/events/:id/points', authJwt, (req, res, next) => {
    const bodyPoints = req.body;
    // Look for the specified event
    req.db.Event.findById(req.params.id)
    .then((event) => {
        if (!event) { // Event not found. Not Found.
            const error = new Error(`Event with ID: ${req.params.id} not found.`);
            error.status = 404;
            throw error;
        }
        return event;
    })
    .then((event) => {
        // Query for the custom points.
        return req.db.CustomPoint.findAll({
            where: {
                id: {
                    [req.db.Sequelize.Op.in]: bodyPoints.map((point) => point.id)
                }
            }
        });
    })
    .then((points) => { // TODO: Determine operators for points.
        return Promise.all([
            points,
            req.db.EventCustomPoint.destroy({ // Destroy all previous points.
                force: true,
                where: {
                    event_id: req.params.id
                }
            }),
        ]);
    })
    .then(([points]) => { // Compose object for bulkCreate rules.
        return points.map((point) => {
            const current = bodyPoints.find((_point) => _point.id == point.id);
            return {
                custom_point_id: current.id,
                event_id: req.params.id,
                points: current.points
            };
        });
    })
    .then((points) => req.db.EventCustomPoint.bulkCreate(points))
    .then((points) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
