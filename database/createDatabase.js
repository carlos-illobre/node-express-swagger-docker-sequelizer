const Sequelize = require('sequelize');
const glob = require('glob');
const config = require('./config.js')[process.env.NODE_ENV];
const createUmzug = require('./createUmzug.js');

module.exports = ({ logger }) => {

    config.logging = (msg) => logger.info(msg);

    const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );

    return createUmzug({ sequelize })
    .up()
    .then(() => {

        const db = glob.sync('../models/**/*.js', { cwd: __dirname })
        .map((filename) => {
            return sequelize.import(filename);
        })
        .reduce((db, model) => {
            db[model.name] = model;
            return db;
        }, {});

        Object.keys(db)
        .filter(modelName => db[modelName].associate)
        .map(modelName => db[modelName].associate(db));

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

        return db;

    });

};
