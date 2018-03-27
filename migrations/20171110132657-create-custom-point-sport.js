'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('custom_points_sport', {
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
            sport_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'sports',
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
        return queryInterface.dropTable('custom_points_sport');
    }
};
