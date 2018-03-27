'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('teams', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            registration_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'registration_systems',
                    key: 'id'
                }
            },
            external_team_id: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            coach_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'coaches',
                    key: 'id'
                }
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
        return queryInterface.dropTable('teams');
    }
};
