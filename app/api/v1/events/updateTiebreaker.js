const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/events/:id/tiebreaker', authJwt, (req, res, next) => {
    const bodyRules = req.body;
    // Look for the specified event
    req.db.Event.findById(req.params.id)
    .then((event) => {
        if (!event) { // Event not found. Not Found.
            const error = new Error(`Event with ID: ${req.params.id} not found.`);
            error.status = 404;
            throw error;
        }
        return event;
    })
    .then((event) => {
        // Query for the rules.
        const sportId = event.sport_id;
        return req.db.Rule.findAll({
            where: {
                id: {
                    [req.db.Sequelize.Op.in]: bodyRules.map((rule) => rule.id)
                },
                sport_id: sportId
            }
        });
    })
    .then((rules) => { // TODO: Determine operators for rules.
        return Promise.all([
            rules,
            req.db.EventRule.destroy({ // Destroy all previous rules.
                force: true,
                where: {
                    event_id: req.params.id
                }
            })
        ]);
    })
    .then(([rules]) => { // Compose object for bulkCreate rules.
        return rules.map((rule) => {
            return bodyRules.filter((_rule) => _rule.id == rule.id);
        });
    })
    .then((rules) => {
        return [].concat(...rules);
    })
    .then((rules) => {
        return rules.map((rule) => {
            return {
                rule_id: rule.id,
                event_id: req.params.id,
                value: rule.value,
                order: rule.order,
                teams: rule.teams
            };
        });
    })
    .then((rules) => req.db.EventRule.bulkCreate(rules))
    .then((rules) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
