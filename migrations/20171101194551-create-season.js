module.exports = {

    up: (queryInterface, Sequelize) => {
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
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('seasons');
    }

};
