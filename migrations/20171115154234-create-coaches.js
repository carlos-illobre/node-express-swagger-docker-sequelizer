'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('coaches', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            first_name: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            last_name: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            email: {
                type: Sequelize.STRING(50)
            },
            phone: {
                type: Sequelize.STRING(20)
            },
            registration_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'registration_systems',
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
        return queryInterface.dropTable('coaches');
    }
};
