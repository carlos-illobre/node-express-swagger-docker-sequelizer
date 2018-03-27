const http = require('http');
const port = process.env.PORT || 8080;

const logger = require('./logger.js');
const createDatabase = require('./database/createDatabase.js');
const createExpressApp = require('./app/createExpressApp.js');
const createClientError = require('./app/createClientError.js');

logger.info('*************************************************');
logger.info(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`process.env.JWT_SEED: ${process.env.JWT_SEED}`);
logger.info(`process.env.JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN}`);
logger.info(`process.env.MYSQL_USER: ${process.env.MYSQL_USER}`);
logger.info('*************************************************');

createDatabase({ logger })
.then(database => createExpressApp({
    logger,
    database,
    createClientError,
}))
.then((app) => {
    return http
    .createServer(app)
    .listen(port)
    .on('listening', function() {
        const addr = this.address();
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        logger.info(`Listening on ${bind}`);
    })
    .on('error', function(error) {
        if (error.syscall !== 'listen') throw error;
        const addr = this.address() || { port };
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        switch (error.code) {
        case 'EACCES':
            logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
        }
    });
})
.then(http => module.exports = http)
.catch(error => logger.error(error));
