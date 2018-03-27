const Joi = require('joi');

module.exports = {
    options: {
        allowUnknownBody: false,
    },
    body: {
        sport: Joi.object().keys({
            id: Joi.number().integer().min(1).required(),
        }).required(),
        name: Joi.string().max(200).required(),
        dates: Joi.object().keys({
            start: Joi.date().iso().required(),
            end: Joi.date().iso().required(),
        }).required(),
        image: Joi.object().keys({
            url: Joi.string().uri().required(),
        }).required(),
        teams: Joi.array().items(
            Joi.object().keys({
                external_team_id: Joi.number().integer().min(1),
                name: Joi.string().max(200).required(),
                external_coach_id: Joi.number().integer().min(1),
            })
        ),
        divisions: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().max(200).required(),
                abbreviation: Joi.string(),
                skill: Joi.string().required(),
                gender: Joi.object().keys({
                    id: Joi.number().min(1).required(),
                }).required(),
                teams: Joi.array().items(
                    Joi.object().keys({
                        external_team_id: Joi.number().min(1).required(),
                    })
                ).required(),
            })
        ),
        coaches: Joi.array().items(
            Joi.object().keys({
                external_coach_id: Joi.number().min(1),
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                email: Joi.string().email().required(),
                phone: Joi.string(),
            })
        ),
        facilities: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                abbreviation: Joi.string().required(),
                street: Joi.string().required(),
                city: Joi.string().required(),
                zip: Joi.string().required(),
                state: Joi.object().keys({
                    name: Joi.string().required(),
                    abbreviation: Joi.string().required(),
                }).required(),
                map: Joi.object().keys({
                    url: Joi.string().uri(),
                })
            })
        ),
    }
};
