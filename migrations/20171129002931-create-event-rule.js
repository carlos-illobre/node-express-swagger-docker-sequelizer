'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('events_rules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            rule_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'rules',
                    key: 'id'
                }
            },
            event_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'events',
                    key: 'id'
                }
            },
            value: {
                type: Sequelize.STRING
            },
            order: {
                type: Sequelize.INTEGER
            },
            teams: {
                type: Sequelize.INTEGER
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('events_rules');
    }
};
