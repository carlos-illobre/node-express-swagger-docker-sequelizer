'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('rules', 'values', {
            type: Sequelize.TEXT
        })
        .then(() => queryInterface.addColumn('rules', 'value', {
            type: Sequelize.STRING
        }))
        .then(() => queryInterface.addColumn('rules', 'teams', {
            type: Sequelize.INTEGER
        }));
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('rules', 'values')
        .then(() => queryInterface.removeColumn('rules', 'value'))
        .then(() => queryInterface.removeColumn('rules', 'teams'));
    }
};
