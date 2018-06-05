const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.get('/v1/operators/me/tiebreakers', authJwt, (req, res, next) => {

    req.db.OperatorRule.findAll({
        attributes: ['rule_id', 'order', 'teams', 'value'],
        where: {
            operator_id: req.user.id
        }
    })
    .then((rules) => {
        return rules.map((rule) => {
            return {
                id: rule.rule_id,
                order: rule.order,
                teams: rule.teams,
                value: rule.value
            };
        });
    })
    .then((rules) => {
        res.send({
            tiebreakers: rules,
        });
    })
    .catch(next);

});
