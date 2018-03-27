const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');

const apiRouter = require('./api/createApiRouter.js')();
const createPassport = require('./createPassport.js');
const swaggerDocument = require('./getSwaggerDocument.js')();

module.exports = ({
    database,
    logger,
    createClientError,
}) => {
    const app = express()
    .use(expressWinston.logger({
        winstonInstance: logger,
        msg: '{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
        meta: false
    }))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, true))
    .use('/files', express.static(path.join(process.env.PWD, 'uploads')))
    .use((req, res, next) => {
        req.base = `${req.protocol}://${req.get('host')}`;
        req.logger = logger;
        req.db = database;
        return next();
    })
    .use(createPassport({ db: database }).initialize())
    .use(cors())
    .options('*', cors())
    .use('/api', apiRouter)
    .use((req, res) => res.sendStatus(404))
    .use((err, req, res, next) => {

        const error = createClientError(err) || err;

        if (!error.status || error.status >= 500) {
            logger.error(error, error);
        }

        res.status(error.status || 500).send({
            error: error.message
        });

    });
    return Promise.resolve(app);
};
