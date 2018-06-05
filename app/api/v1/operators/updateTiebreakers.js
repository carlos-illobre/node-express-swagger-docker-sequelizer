const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/operators/me/tiebreakers', authJwt, (req, res, next) => {
    const bodyRules = req.body;
    // Look for the specified event
    return req.db.OperatorRule.findAll({
        where: {
            rule_id: {
                [req.db.Sequelize.Op.in]: bodyRules.map((rule) => rule.id)
            },
            operator_id: req.user.id
        }
    })
    .then((rules) => { // TODO: Determine operators for rules.
        return Promise.all([
            rules,
            req.db.OperatorRule.destroy({ // Destroy all previous rules.
                force: true,
                where: {
                    operator_id: req.user.id
                }
            })
        ]);
    })
    .then(([rules]) => { // Compose object for bulkCreate rules.
        return rules.map((rule) => {
            return bodyRules.filter((_rule) => _rule.id == rule.rule_id);
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
    .then((rules) => req.db.OperatorRule.bulkCreate(rules))
    .then((rules) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
