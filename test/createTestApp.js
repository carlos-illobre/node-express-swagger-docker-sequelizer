const createDatabase = require('../database/createDatabase.js');
const createExpressApp = require('../app/createExpressApp.js');
const logger = require('../logger.js');
const loggerDummy = require('./logger.dummy.js');
const generateOperatorJwt = require(`${process.env.PWD}/app/api/v1/operators/generateOperatorJwt.js`);
const generateJwt = require(`${process.env.PWD}/app/api/v1/users/generateJwt.js`);
const createClientError = require('../app/createClientError.js');

process.setMaxListeners(0);

let extraErrorFields;

module.exports = async (that, useLogger) => {

    extraErrorFields = {};

    const database = await createDatabase({ logger: useLogger ? logger : loggerDummy });

    const app = await createExpressApp({
        logger: useLogger ? logger : loggerDummy,
        database,
        createClientError: (error) => {
            that.originalError = error;
            return createClientError({...error, ...extraErrorFields});
        },
    });

    app.setExtraErrorFields = function(fields) {
        extraErrorFields = fields;
    };

    const operator = await database.Operator.create({
        name: 'operator',
        password: 'test'
    });

    const admin = await database.User.create({
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@email',
        phone: '999999999',
    });

    await admin.addAdminRole();

    const adminJwt = generateJwt(admin);
    
    const jwt = generateOperatorJwt(operator);

    that.db = database;
    that.app = app;
    that.operator = operator;
    that.jwt = jwt;
    that.adminJwt = adminJwt;
    that.admin = admin;

    return {
        app,
        database,
        operator,
        jwt,
        adminJwt,
        admin,
    };
};
