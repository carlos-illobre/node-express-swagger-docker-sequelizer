module.exports = {
    development: {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        sync: false,
        operatorsAliases: false,
        define: {
            createdAt: 'created',
            updatedAt: 'modified',
            deletedAt: 'deleted',
            paranoid: true,
            underscored: true,
        },
    },
    test: {
        username: 'root',
        password: null,
        database: 'scheduler',
        host: '127.0.0.1',
        dialect: 'sqlite',
        storage: ':memory:',
        operatorsAliases: false,
        define: {
            createdAt: 'created',
            updatedAt: 'modified',
            deletedAt: 'deleted',
            paranoid: true,
            underscored: true,
        },
    },
    staging: {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        sync: false,
        operatorsAliases: false,
        define: {
            createdAt: 'created',
            updatedAt: 'modified',
            deletedAt: 'deleted',
            paranoid: true,
            underscored: true,
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    },
    production: {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        sync: false,
        operatorsAliases: false,
        define: {
            createdAt: 'created',
            updatedAt: 'modified',
            deletedAt: 'deleted',
            paranoid: true,
            underscored: true,
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
};
