const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.delete('/v1/divisions/:id/teams/:teamId/drop', authJwt, async (req, res, next) => {
    // TODO: Once the template functionality is complete we need to revisit to apply proper validation regarding template assignement.
    await req.db.DivisionTeam.destroy({
        where: {
            team_id: req.params.teamId,
            division_id: req.params.id
        },
        force: true
    });
    res.sendStatus(204);
});
