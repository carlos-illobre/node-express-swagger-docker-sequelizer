const express = require('express');
const halson = require('halson');

module.exports = express
.Router({mergeParams: true})
.get('/v1/users/:id', async (req, res, next) => {

    const user = await req.db.User.findById(req.params.id, {
        attributes: [
            'first_name',
            'last_name',
            'email',
            'phone',
        ],
        include: [{
            model: req.db.Role,
            as: 'roles',
            attributes: [ 'name' ],
        }],
    });

    if (!user) {
        const error = new Error(`User ${req.params.id} not found`);
        error.status = 404;
        return next(error);
    }

    const response = halson({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        roles: user.roles.map(role => halson({
            name: role.name,
        })),
    })
    .addLink('self', `${req.base}${req.originalUrl}`);

    res.json(response);

});
