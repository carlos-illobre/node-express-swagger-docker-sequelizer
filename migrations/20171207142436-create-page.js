'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('pages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            logo_1: {
                type: Sequelize.TEXT
            },
            logo_2: {
                type: Sequelize.TEXT
            },
            logo_3: {
                type: Sequelize.TEXT
            },
            notes: {
                type: Sequelize.TEXT
            },
            social_media: {
                type: Sequelize.STRING
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
                allowNull: true,
                type: Sequelize.DATE,
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('pages');
    }
};
