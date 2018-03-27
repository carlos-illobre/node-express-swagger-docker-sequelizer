'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('registration_systems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull:false,
                type: Sequelize.STRING(100)
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
        return queryInterface.dropTable('registration_systems');
    }
};
