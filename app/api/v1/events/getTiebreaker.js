const express = require('express');

module.exports = express
.Router({mergeParams: true})
.get('/v1/events/:id/tiebreaker', (req, res, next) => {
    // Look for the specified event.
    req.db.Event.findOne({
        where: {
            id: req.params.id
        }
    })
    .then((event) => {
        return req.db.EventRule.findAll({
            where: {
                event_id: event.id
            }
        });
    })
    .then((rules) => {
        return rules.map((rule) => {
            return {
                id: rule.rule_id,
                value: rule.value,
                teams: rule.teams,
                order: rule.order
            };
        });
    })
    .then((rules) => {
        return rules.sort((a, b) => a.order - b.order);
    })
    .then((rules) => {
        res.send({
            tiebreakers: rules
        });
    })
    .catch(next);
});
