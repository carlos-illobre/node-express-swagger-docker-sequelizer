'use strict';

module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('divisions', 'abbreviation', {
            type: Sequelize.STRING(10),
        })
        .then(() => queryInterface.addColumn('divisions', 'skill', {
            type: Sequelize.STRING,
        }));
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('divisions', 'skill')
        .then(() => queryInterface.removeColumn('divisions', 'abbreviation'));
    }

};
