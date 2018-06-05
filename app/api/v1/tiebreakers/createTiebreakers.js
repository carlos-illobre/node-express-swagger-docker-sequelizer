const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.post('/v1/tiebreakers', authJwt, (req, res, next) => {
    // if (req.user.role != 'Admin') {
    //     const error = new Error('This is an Administrator only resource.');
    //     error.status = 401;
    //     throw error;
    // }
    req.db.Rule.create({
        name: req.body.name,
        values: JSON.stringify(req.body.values),
        value: req.body.value,
        order: req.body.order,
        sport_id: req.body.sport_id,
        teams: req.body.teams,
    })
    .then((rule) => {
        const location = `${req.domain}/api/v1/tiebreakers`;
        res.setHeader('Location', location);
        res.status(201).json({
            id: rule.id
        });
    })
    .catch(next);
});
