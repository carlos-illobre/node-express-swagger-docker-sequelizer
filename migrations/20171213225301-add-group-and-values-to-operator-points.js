'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('operators_custom_points', 'values', {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: null
        })
        .then(() => {
            return queryInterface.addColumn('operators_custom_points', 'group', {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null
            });
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('operators_custom_points', 'group')
        .then(() => {
            return queryInterface.removeColumn('operators_custom_points', 'values');
        });
    }
};
