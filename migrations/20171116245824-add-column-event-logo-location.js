'use strict';

module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('events', 'location', {
            type: Sequelize.STRING,
        })
        .then(() => queryInterface.removeColumn('events', 'type_id'))
        .then(() => queryInterface.removeColumn('events', 'season_id'))
        .then(() => queryInterface.dropTable('event_types'))
        .then(() => queryInterface.dropTable('seasons'));
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.createTable('seasons', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING(50),
            },
            operator_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'operators',
                    key: 'id',
                },
            },
            start_date: {
                type: Sequelize.DATE,
            },
            end_date: {
                type: Sequelize.DATE,
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
            },
        })
        .then(() => {
            return queryInterface.createTable('event_types', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                name: {
                    allowNull: false,
                    type: Sequelize.STRING(50),
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
                },
            });
        })
        .then(() => queryInterface.addColumn('events', 'season_id', {
            type: Sequelize.STRING,
        }))
        .then(() => queryInterface.addColumn('events', 'type_id', {
            type: Sequelize.STRING,
        }))
        .then(() => queryInterface.removeColumn('events', 'location'));
    }

};
