const express = require('express');

module.exports = express
.Router({mergeParams: true})
.get('/v1/tiebreakers', (req, res, next) => {

    req.db.Rule.findAll({
        attributes: ['id', 'name', 'order', 'teams', 'values', 'value', 'sport_id']
    })
    .then((rules) => {
        return rules.map((rule) => {
            rule.values = JSON.parse(rule.values);
            return rule;
        });
    })
    .then((rules) => {
        res.send({
            tiebreakers: rules,
        });
    })
    .catch(next);

});
