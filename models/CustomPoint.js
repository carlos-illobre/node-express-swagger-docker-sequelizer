'use strict';
module.exports = (sequelize, DataTypes) => {
    // Joy
    const Joi = require('joi');
    const validation = Joi.object().keys({
        id: Joi.any(),
        name: Joi.string().required(),
        values: Joi.string().required(),
        points: Joi.number().required(),
        created: Joi.date(),
        modified: Joi.date(),
        deleted: Joi.any()
    });
    // Sequelize object
    const CustomPoint = sequelize.define('CustomPoint', {
        name: DataTypes.STRING,
        values: DataTypes.TEXT,
        points: DataTypes.INTEGER
    }, {
        tableName: 'custom_points',
        hooks: {
            beforeValidate: (CustomPoint, options, cb) => {
                return Joi.validate(CustomPoint.dataValues, validation, {allowUnknown: true});
            }
        }
    });
    // Relationships setup
    CustomPoint.associate = (models) => {
        CustomPoint.Events = CustomPoint.hasMany(models.EventCustomPoint, {
            foreignKey: 'custom_point_id'
        });
        CustomPoint.Operators = CustomPoint.hasMany(models.OperatorCustomPoint, {
            foreignKey: 'custom_point_id'
        });
    };

    return CustomPoint;
};
