const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/divisions/:id/abbreviation', authJwt, validate({
    body: {
        abbreviation: Joi.string().max(200).required(),
    }
}), async (req, res, next) => {
    try {
        const count = await req.db.Division.update({
            abbreviation: req.body.abbreviation,
        }, {
            where: {
                id: req.params.id,
            },
        });

        if (count[0] == 0) {
            const error = new Error(`Division ${req.params.id} not found`);
            error.status = 404;
            throw error;
        }

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});
