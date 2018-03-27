const jwt = require('jsonwebtoken');

module.exports = (operator) => {

    return jwt.sign({
        sub: {
            id: operator.id,
            role: 'Operator',
        },
    }, process.env.JWT_SEED, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

};
