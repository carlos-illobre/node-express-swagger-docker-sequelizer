'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('custom_points_event', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            custom_point_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'custom_points',
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
            points: {
                type: Sequelize.INTEGER
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
        return queryInterface.dropTable('custom_points_event');
    }
};
