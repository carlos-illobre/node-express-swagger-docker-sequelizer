const logger = module.exports = require('winston');

logger.add(logger.transports.File, {
    name: 'debug-file',
    filename: 'log.log',
    level: 'debug',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    exitOnError: true,
    json: false,
    maxsize: 104857600,
    maxFiles: 5
});

logger.add(logger.transports.Console, {
    name: 'error-console',
    level: 'error',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    exitOnError: true
});
