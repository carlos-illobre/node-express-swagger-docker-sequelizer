const express = require('express');
const authJwt = require(`${process.env.PWD}/app/auth/jwtAuthMiddleware.js`);
const multer  = require('multer');
const storage = multer.memoryStorage();
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
.post('/v1/operators/me/page/details', [authJwt, fields], (req, res, next) => {
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

    req.db.OperatorPage.update(pageDetails, {
        where: {
            operator_id: req.user.id
        }
    })
    .then((details) => {
        res.status(204);
        res.send({});
    })
    .catch(next);
});
