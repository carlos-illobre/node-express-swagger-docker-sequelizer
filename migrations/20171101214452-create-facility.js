module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('facilities', {
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
        abbreviation: {
            allowNull: false,
            type: Sequelize.STRING(10),
        },
        street: {
            allowNull: false,
            type: Sequelize.STRING(50),
        },
        city: {
            allowNull: false,
            type: Sequelize.STRING(50),
        },
        state: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'states',
                key: 'id',
            },
        },
        zip: {
            allowNull: false,
            type: Sequelize.STRING(20),
        },
        mapUrl: {
            allowNull: false,
            type: Sequelize.STRING(500),
        },
        operator_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'operators',
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
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),

    down: (queryInterface, Sequelize) => queryInterface.dropTable('facilities')

};
