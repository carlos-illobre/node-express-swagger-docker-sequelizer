const express = require('express');

module.exports = express
.Router({mergeParams: true})
.get('/v1/events/:id/points', async (req, res, next) => {

    const event = await req.db.Event.findById(req.params.id, {
        attributes: ['id'],
        include: [{
            model: req.db.CustomPoint,
            as: 'customPoints',
            attributes: ['id', 'points'],
        }],
    });

    res.send({
        points: event.customPoints.map(customPoint => ({
            id: customPoint.id,
            points: customPoint.points,
        })),
    });

});
