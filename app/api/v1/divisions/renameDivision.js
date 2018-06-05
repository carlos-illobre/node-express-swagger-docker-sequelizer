const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/divisions/:id/name', authJwt, validate({
    body: {
        name: Joi.string().max(200).required(),
    }
}), (req, res, next) => {

    req.db.Division.update({
        name: req.body.name,
    }, {
        where: {
            id: req.params.id,
        },
    })
    .then(([count]) => {

        if (!count) {
            const error = new Error(`Division ${req.params.id} not found`);
            error.status = 404;
            throw error;
        }

        res.sendStatus(204);

    })
    .catch(next);

});
