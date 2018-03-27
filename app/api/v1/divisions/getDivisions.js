const express = require('express');
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.get('/v1/divisions', async (req, res, next) => {
    const divisions = await req.db.Division.findAll({
        attributes: ['id', 'name'],
        include: [{
            model: req.db.Gender,
            as: 'gender',
            attributes: ['name'],
        }]
    });

    const response = divisions.map((division) => {
        return halson({
            id: division.id,
            name: division.name,
            gender: division.gender,
        })
        .addLink('self', `${req.base}${req.originalUrl}/${division.id}`);
    });

    res.json({ divisions: response });
});
