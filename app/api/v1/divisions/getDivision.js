const express = require('express');
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.get('/v1/divisions/:id', async (req, res, next) => {
    try {

        const division = await req.db.Division.findById(req.params.id, {
            attributes: ['id', 'name'],
            include: [{
                model: req.db.Gender,
                as: 'gender',
                attributes: ['name'],
            }]
        });

        if (!division) {
            const error = new Error(`Division ${req.params.id} not found`);
            error.status = 404;
            throw error;
        }

        const response = halson({
            id: division.id,
            name: division.name,
            gender: division.gender,
        })
        .addLink('self', `${req.base}${req.originalUrl}`);

        res.json(response);

    } catch(error) {
        next(error);
    }
});
