const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);
const authAdminJwt = require(`${process.env.PWD}/app/auth/adminAuthJwtMiddleware.js`);
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.post('/v1/users', authJwt, authAdminJwt, async (req, res, next) => {

    const user = await req.db.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
    });

    const location = `${req.base}/api/v1/users/${user.id}`;

    res.setHeader('Location', location);
    res.status(201).json(
        halson({
            id: user.id
        })
        .addLink('self', location)
    );

});
