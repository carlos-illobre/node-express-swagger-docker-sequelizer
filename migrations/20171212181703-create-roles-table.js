module.exports = {

    up: (queryInterface, Sequelize) => {

        return queryInterface.createTable('roles', {
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

            const today = new Date().toISOString().slice(0, 10);

            return queryInterface.sequelize.query(`
                insert into roles (name, created, modified) values
                ('Admin', '${today}', '${today}'),
                ('Operator', '${today}', '${today}');
            `);

        })
        .then(() => {
            return queryInterface.createTable('users_roles', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                user_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                },
                role_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'roles',
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
            });
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users_roles')
        .then(() => queryInterface.dropTable('roles'));
    }

};
