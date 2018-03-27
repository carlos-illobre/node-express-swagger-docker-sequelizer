module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        first_name: {
            allowNull: true,
            type: Sequelize.STRING(100),
        },
        last_name: {
            allowNull: true,
            type: Sequelize.STRING(100),
        },
        email: {
            allowNull: true,
            type: Sequelize.STRING(100),
        },
        phone: {
            allowNull: true,
            type: Sequelize.STRING(100),
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

    down: (queryInterface, Sequelize) => queryInterface.dropTable('users')

};

