const Sequelize = require('sequelize');
const Umzug = require('umzug');

module.exports = ({ sequelize }) => {
    return new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize,
        },
        migrations: {
            path: 'migrations',
            pattern: /^\d+[\w-]+\.js$/,
            wrap(migrate) {
                return migrate.bind(null, sequelize.getQueryInterface(), Sequelize);
            }
        }
    });
};
