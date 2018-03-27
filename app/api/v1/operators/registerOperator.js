const express = require('express');

const generateOperatorJwt = require('./generateOperatorJwt.js');

module.exports = express
.Router({mergeParams: true})
.post('/v1/operators', (req, res, next) => {

    req.db.Operator.create({
        name: req.body.name,
        password: req.body.password,
    })
    .then(operator => {

        res.setHeader('Location', `${req.base}${req.originalUrl}/${operator.id}`);
        res.status(201).send({
            auth: true,
            token: generateOperatorJwt(operator),
        });

    })
    .catch(next);

});
