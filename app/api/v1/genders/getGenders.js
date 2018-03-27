const express = require('express');
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.get('/v1/genders', (req, res, next) => {

    req.db.Gender.findAll({
        attributes: ['id', 'name'],
        raw: true,
    })
    .then((genders) => {

        const response = genders.map((gender) => {
            return halson(gender)
            .addLink('self', `${req.base}${req.originalUrl}/${gender.id}`);
        });

        res.json({ genders: response });
    })
    .catch(next);

});
