const express = require('express');
const halson = require('halson');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);

module.exports = express
.Router({mergeParams: true})
.get('/v1/operators/me/page/details', authJwt, (req, res, next) => {

    req.db.OperatorPage.findOne({
        attributes: ['logo_1', 'logo_2', 'notes', 'logo_3', 'social_media'],
        where: {
            operator_id: req.user.id
        }
    })
    .then((page) => {
        return halson({
            notes: page.notes,
            social_media: page.social_media,
        })
        .addLink('logo_1', `${req.base}${req.originalUrl}${page.logo_1}`)
        .addLink('logo_2', `${req.base}${req.originalUrl}${page.logo_2}`)
        .addLink('logo_3', `${req.base}${req.originalUrl}${page.logo_3}`);
    })
    .then((page) => {
        res.send({
            page: page,
        });
    })
    .catch(next);

});
