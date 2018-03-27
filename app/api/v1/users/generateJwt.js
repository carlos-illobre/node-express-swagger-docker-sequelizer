const jwt = require('jsonwebtoken');

module.exports = (user) => {
    
    return jwt.sign({
        sub: {
            id: user.id,
        },
    }, process.env.JWT_SEED, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

};
