'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('custom_points', 'group', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
        })
        .then(() => {
            return queryInterface.sequelize.query('UPDATE `custom_points` SET `group` = 1 WHERE `name` IN(\'Points Per Goal\', \'Maximum Points Per Goal\');');
        })
        .then(() => {
            return queryInterface.sequelize.query('UPDATE `custom_points` SET `group` = 2 WHERE `name` = \'Points for a Shoutout\';');
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('custom_points', 'group');
    }
};
