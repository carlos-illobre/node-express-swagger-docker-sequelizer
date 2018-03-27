// Default rules.
const rules = {
    Basketball: [
        { name: 'Head to Head', values: {}, value: 1, teams: 2 },
        { name: 'Point Differential', values: {}, value: 1, teams: 2 },
        { name: 'Points Against', values: {}, value: 1, teams: 2 },
        { name: 'Points For', values: {}, value: 1, teams: 2 },
        { name: 'Coin Flip', values: {}, value: 1, teams: 2 },
        { name: 'Common Point differential', values: {}, value: 1, teams: 3 },
        { name: 'Common Wins', values: {}, value: 1, teams: 3 },
        { name: 'Common Points Against', values: {}, value: 1, teams: 3 },
        { name: 'Common Points For', values: {}, value: 1, teams: 3 },
        { name: 'Points For', values: {}, value: 1, teams: 3 },
        { name: 'Points Against', values: {}, value: 1, teams: 3 },
        { name: 'Point Differential', values: {}, value: 1, teams: 3 },
        { name: 'Coin Flip', values: {}, value: 1, teams: 3 }
    ],
    Soccer: [
        { name: 'Head to Head', values: {}, value: 1, teams: 2 },
        { name: 'Point Differential', values: {}, value: 1, teams: 2 },
        { name: 'Points Against', values: {}, value: 1, teams: 2 },
        { name: 'Points For', values: {}, value: 1, teams: 2 },
        { name: 'Coin Flip', values: {}, value: 1, teams: 2 },
        { name: 'Common Point differential', values: {}, value: 1, teams: 3 },
        { name: 'Common Wins', values: {}, value: 1, teams: 3 },
        { name: 'Common Points Against', values: {}, value: 1, teams: 3 },
        { name: 'Common Points For', values: {}, value: 1, teams: 3 },
        { name: 'Points For', values: {}, value: 1, teams: 3 },
        { name: 'Points Against', values: {}, value: 1, teams: 3 },
        { name: 'Point Differential', values: {}, value: 1, teams: 3 },
        { name: 'Coin Flip', values: {}, value: 1, teams: 3 }
    ]
};

module.exports = {
    up: (queryInterface, Sequelize) => {
        // Models
        const Rule = queryInterface.sequelize.import('../models/Rule.js');
        const Sport = queryInterface.sequelize.import('../models/Sport.js');
        // Starting loop.
        return Object.keys(rules).reduce((promise, name) => {
            return promise.then(() => Sport.findOrCreate({
                where: {
                    name: name
                }
            }))
            .then((sport) => {
                return rules[name].reduce((promise, rule) => {
                    return promise.then(() => Rule.findOrCreate({ // eslint-disable-line promise/no-nesting
                        where : {
                            name: rule.name,
                            values: JSON.stringify(rule.values),
                            value: rule.value,
                            teams: rule.teams,
                            sport_id: sport[0].dataValues.id
                        }
                    }));
                }, Promise.resolve());
            });
        }, Promise.resolve());
    },

    down: (queryInterface, Sequelize) => {
        // Models
        const Rule = queryInterface.sequelize.import('../models/Rule.js');
        const Sport = queryInterface.sequelize.import('../models/Sport.js');
        // Starting loop.
        if (process.env.NODE_ENV !== 'test') {
            return Rule.destroy({
                force: true,
                truncate: true
            })
            .then(() => {
                return Sport.destroy({
                    force: true,
                    truncate: true
                });
            });
        }
    }
};
