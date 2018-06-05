const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);
const authAdminJwt = require(`${process.env.PWD}/app/auth/adminAuthJwtMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.put('/v1/users/:id', authJwt, authAdminJwt, async (req, res, next) => {
    try {
        const [count] = await req.db.User.update({
            ...(req.body),
        }, {
            where: {
                id: req.params.id,
            }
        });
        if (!count) {
            const error = new Error(`User ${req.params.id} not found`);
            error.status = 404;
            throw error;
        }
        res.sendStatus(204);
    } catch(error) {
        next(error);
    }
});
