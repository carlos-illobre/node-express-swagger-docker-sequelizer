const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.post('/v1/points', authJwt, (req, res, next) => {
    // if (req.user.role != 'Admin') {
    //     const error = new Error('This is an Administrator only resource.');
    //     error.status = 401;
    //     throw error;
    // }
    req.db.CustomPoint.create({
        name: req.body.name,
        values: JSON.stringify(req.body.values),
        points: req.body.points,
        group: req.body.group
    })
    .then((point) => {
        const location = `${req.domain}/api/v1/points`;
        res.setHeader('Location', location);
        res.status(201).json({
            id: point.id
        });
    })
    .catch(next);
});
