'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('events', 'image_url', {
            type: Sequelize.STRING,
        })
        .then(() => queryInterface.removeColumn('events', 'division_id'))
        .then(() => queryInterface.removeColumn('events', 'zip_code'))
        .then(() => queryInterface.removeColumn('events', 'state_id'))
        .then(() => queryInterface.removeColumn('events', 'city'))
        .then(() => queryInterface.changeColumn('events', 'name', {
            type: Sequelize.STRING(100),
            unique: true,
            allowNull: false,
        }));
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('events', 'name', {
            allowNull: false,
            type: Sequelize.STRING(100),
            unique: false,
        })
        .then(() => queryInterface.addColumn('events', 'city', {
            allowNull: false,
            type: Sequelize.STRING(50),
        }))
        .then(() => {
            return queryInterface.addColumn('events', 'state_id', {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'states',
                    key: 'id',
                },
            });
        })
        .then(() => {
            return queryInterface.addColumn('events', 'zip_code', {
                allowNull: false,
                type: Sequelize.STRING(15)
            });
        })
        .then(() => {
            return queryInterface.addColumn('events', 'division_id', {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'divisions',
                    key: 'id',
                },
            });
        })
        .then(() => queryInterface.removeColumn('events', 'image_url'));
    }
};
