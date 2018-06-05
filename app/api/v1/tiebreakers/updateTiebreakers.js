const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/tiebreakers', authJwt, (req, res, next) => {
    // if (req.user.role != 'Admin') {
    //     const error = new Error('This is an Administrator only resource.');
    //     error.status = 401;
    //     throw error;
    // }
    const bodyRules = req.body;
    req.db.Rule.findAll({
        where: {
            id: {
                [req.db.Sequelize.Op.in]: bodyRules.map((rule) => rule.id)
            }
        }
    })
    .then((rules) => {
        return rules.map((rule) => {
            const current = bodyRules.find((_rule) => _rule.id === rule.id);
            rule.name = current.name;
            rule.values = JSON.stringify(current.values);
            rule.value = current.value;
            rule.teams = current.teams;
            rule.order = current.order;
            return rule.save();
        });
    })
    .then((rules) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
