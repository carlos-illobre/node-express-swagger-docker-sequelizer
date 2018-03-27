'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tiebreakers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            sport_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'sports',
                    key: 'id'
                }
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(200)
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
        return queryInterface.dropTable('tiebreakers');
    }
};
