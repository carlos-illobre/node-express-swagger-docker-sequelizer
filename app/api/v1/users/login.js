const express = require('express');
const generateJwt = require('./generateJwt.js');

module.exports = express
.Router({mergeParams: true})
.post('/v1/users/login', async (req, res, next) => {

    const user = await req.db.User.findOne({
        where: {
            email: req.body.email,
        },
    });

    if (!user) {
        const error = new Error('Unauthorized');
        error.status = 401;
        return next(error);
    }

    res.status(201).send({
        auth: true,
        token: generateJwt(user),
    });

});
