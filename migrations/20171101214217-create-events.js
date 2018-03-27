module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable('events', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING(100),
        },
        type_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'event_types',
                key: 'id',
            },
        },
        operator_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'operators',
                key: 'id',
            },
        },
        sport_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'sports',
                key: 'id',
            },
        },
        start_date: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        end_date: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        city: {
            allowNull: false,
            type: Sequelize.STRING(50),
        },
        state_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'states',
                key: 'id',
            },
        },
        zip_code: {
            allowNull: false,
            type: Sequelize.STRING(15)
        },
        division_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'divisions',
                key: 'id',
            },
        },
        season_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'seasons',
                key: 'id',
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
            type: Sequelize.DATE,
        },
    }),

    down: (queryInterface, Sequelize) => queryInterface.dropTable('events')

};
