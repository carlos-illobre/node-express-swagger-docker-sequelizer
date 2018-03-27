const express = require('express');

module.exports = express
.Router({mergeParams: true})
.get('/v1/sports', (req, res, next) => {

    req.db.Sport.findAll({
        attributes: ['id', 'name'],
        raw: true,
    })
    .then((sports) => {

        res.send({
            sports,
        });

    })
    .catch(next);

});
