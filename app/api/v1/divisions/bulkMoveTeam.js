const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.patch('/v1/divisions/:id/move', authJwt, (req, res, next) => {
    req.db.DivisionTeam.destroy({
        where: {
            team_id: {
                [req.db.Sequelize.Op.in]: req.body.teams
            }
        },
        force: true
    })
    .then(forward => {
        return Promise.all([
            req.body.teams.map(team => {
                return {
                    division_id: req.params.id,
                    team_id: team
                };
            })
        ]);
    })
    .then(([teams]) => {
        return req.db.DivisionTeam.bulkCreate(teams);
    })
    .then(() => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
