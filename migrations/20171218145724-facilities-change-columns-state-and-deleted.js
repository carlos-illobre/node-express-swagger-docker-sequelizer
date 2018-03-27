'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('facilities', 'state');
        await queryInterface.addColumn('facilities', 'state_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'states',
                key: 'id',
            },
        });
        await queryInterface.changeColumn('facilities', 'deleted', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.changeColumn('events_facilities', 'deleted', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.addColumn('coaches', 'external_coach_id', {
            type: Sequelize.INTEGER,
        });
        await queryInterface.changeColumn('divisions_teams', 'division_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
        await queryInterface.changeColumn('divisions_teams', 'team_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('divisions_teams', 'team_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.changeColumn('divisions_teams', 'division_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.removeColumn('coaches', 'external_coach_id');
        await queryInterface.changeColumn('events_facilities', 'deleted', {
            type: Sequelize.DATE,
            allowNull: false,
        });
        await queryInterface.changeColumn('facilities', 'deleted', {
            type: Sequelize.DATE,
            allowNull: false,
        });
        await queryInterface.removeColumn('facilities', 'state_id');
        await queryInterface.addColumn('facilities', 'state', {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'states',
                key: 'id',
            },
        });
    }
};
