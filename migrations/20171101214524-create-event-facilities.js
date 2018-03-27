module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('events_facilities', {
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
        facility_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'facilities',
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
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),

    down: (queryInterface, Sequelize) => queryInterface.dropTable('events_facilities')

};
