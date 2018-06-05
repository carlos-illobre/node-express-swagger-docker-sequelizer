const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.post('/v1/divisions/:id/teams/:teamId/replace', authJwt, async (req, res, next) => {
    await req.db.DivisionTeam.destroy({
        where: {
            team_id: req.params.teamId,
            division_id: req.params.id
        },
        force: true
    });

    await req.db.DivisionTeam.create({
        division_id: req.params.id,
        team_id: req.body.teamId
    });

    res.status(201).send({});
});
