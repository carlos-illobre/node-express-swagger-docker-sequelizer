'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('divisions_teams', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            division_id: {
                type: Sequelize.INTEGER
            },
            team_id: {
                type: Sequelize.INTEGER
            },
            active: {
                type: Sequelize.BOOLEAN
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted: {
                type: Sequelize.DATE,
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('divisions_teams');
    }
};
