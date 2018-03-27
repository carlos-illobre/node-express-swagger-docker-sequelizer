'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('events_divisions');
        await queryInterface.addColumn('divisions', 'event_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'events',
                key: 'id'
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('divisions', 'event_id');
        await queryInterface.createTable('events_divisions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            event_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'events',
                    key: 'id'
                },
            },
            division_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'divisions',
                    key: 'id'
                },
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
            },
        });
    }
};
