const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/teams/:id', authJwt, (req, res, next) => {
    req.db.OperatorTeam.findOne({
        where: {
            operator_id: req.user.id,
            team_id: req.params.id
        },
        include: {
            model: req.db.Team
        }
    })
    .then(OperatorTeam => {
        return OperatorTeam.Team.updateAttributes({
            name: req.body.name
        });
    })
    .then(OperatorTeam => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
