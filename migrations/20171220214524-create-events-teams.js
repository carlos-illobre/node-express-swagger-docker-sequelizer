module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('events_teams', {
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
        team_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'teams',
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
    }),

    down: (queryInterface, Sequelize) => queryInterface.dropTable('events_teams')

};
