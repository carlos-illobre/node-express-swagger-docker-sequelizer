'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('rules', {
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
            order: {
                type: Sequelize.INTEGER
            },
            sport_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'sports',
                    key: 'id'
                }
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
        return queryInterface.dropTable('rules');
    }
};
