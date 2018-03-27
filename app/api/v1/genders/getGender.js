const express = require('express');
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.get('/v1/genders/:id', (req, res, next) => {

    req.db.Gender.findById(req.params.id, {
        attributes: ['id', 'name'],
        raw: true,
    })
    .then(gender => {

        if (!gender) {
            const error = new Error(`Gender ${req.params.id} not found`);
            error.status = 404;
            throw error;
        }

        const response = halson(gender)
        .addLink('self', `${req.base}${req.originalUrl}`);

        res.json(response);

    })
    .catch(next);

});
