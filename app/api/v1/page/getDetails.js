const express = require('express');
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.get('/v1/page/details', (req, res, next) => {
    const prefix = `${req.base}/files/`;

    req.db.Page.findOne({
        attributes: ['logo_1', 'logo_2', 'notes', 'logo_3', 'social_media']
    })
    .then((page) => {
        return halson({
            notes: page.notes,
            social_media: page.social_media,
        })
        .addLink('logo_1', `${prefix}${page.logo_1}`)
        .addLink('logo_2', `${prefix}${page.logo_2}`)
        .addLink('logo_3', `${prefix}${page.logo_3}`);
    })
    .then((page) => {
        res.send({
            page: page,
        });
    })
    .catch(next);

});
