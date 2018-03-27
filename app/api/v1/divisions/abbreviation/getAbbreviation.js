const express = require('express');

module.exports = express
.Router({mergeParams: true})
.get('/v1/divisions/abbreviation', (req, res, next) => {
    res.json({
        abbreviation: req.db.Division.generateAbbreviation(req.query),
    });
});
