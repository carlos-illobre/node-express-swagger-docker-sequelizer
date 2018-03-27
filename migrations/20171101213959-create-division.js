module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable('divisions', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING(100),
        },
        gender_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'genders',
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
            type: Sequelize.DATE,
        },
    }),

    down: (queryInterface, Sequelize) => queryInterface.dropTable('divisions')

};
