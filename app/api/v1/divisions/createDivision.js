const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.post('/v1/divisions', authJwt, (req, res, next) => {
    
    req.db.Division.create({
        name: req.body.name,
        gender_id: req.body.gender_id,
        abbreviation: req.body.abbreviation,
        skill: req.body.skill,
    })
    .then((division) => {
        const location = `${req.base}${req.originalUrl}/${division.id}`;
        res.setHeader('Location', location);
        res.status(201).json(
            halson({
                id: division.id
            }).addLink('self', location)
        );
    })
    .catch(next);

});
