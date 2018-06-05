const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);
const multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: path.join(process.env.PWD, 'uploads'),
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});
const fields = upload.fields([
    {
        name: 'logo_1',
        maxCount: 1
    },
    {
        name: 'logo_2',
        maxCount: 1
    },
    {
        name: 'logo_3',
        maxCount: 1
    }
]);

module.exports = express
.Router({mergeParams: true})
.post('/v1/page/details', [authJwt, fields], (req, res, next) => {
    // if (req.user.role != 'Admin') {
    //     const error = new Error('This is an Administrator only resource.');
    //     error.status = 401;
    //     throw error;
    // }
    const logo_1 = req.files['logo_1'][0].filename;
    const logo_2 = req.files['logo_2'][0].filename;
    const logo_3 = req.files['logo_3'][0].filename;

    const pageDetails = {
        logo_1: logo_1,
        logo_2: logo_2,
        logo_3: logo_3,
        notes: req.body.notes,
        social_media: req.body.social_media
    };

    req.db.Page.update(pageDetails, {
        where: {
            id: 1
        }
    })
    .then((details) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
