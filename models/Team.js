'use strict';
module.exports = (sequelize, DataTypes) => {
    // Joy
    const Joi = require('joi');
    // Joi object
    const validation = Joi.object().keys({
        id: Joi.any(),
        name: Joi.string().max(100).required(),
        registration_id: Joi.number().allow(null),
        external_team_id: Joi.number().allow(null),
        coach_id: Joi.number().allow(null),
        created: Joi.date(),
        modified: Joi.date(),
        deleted: Joi.any()
    });
    // Sequelize object
    const Team = sequelize.define('Team', {
        name: DataTypes.STRING,
        registration_id: DataTypes.INTEGER,
        external_team_id: DataTypes.INTEGER,
        coach_id: DataTypes.INTEGER
    }, {
        tableName: 'teams',
        hooks: {
            beforeValidate: (Team, options, cb) => {
                return Joi.validate(Team.dataValues, validation, {allowUnknown: true});
            }
        }
    });
    // Relationships setup
    Team.associate = (models) => {
        Team.Coach = Team.belongsTo(models.Coach, {as: 'coach'} );
        Team.RegistrationSystem = Team.belongsTo(models.RegistrationSystem, {
            foreignKey: 'registration_id'
        });
        Team.Divisions = Team.belongsToMany(models.Division, {
            through: models.DivisionTeam,
            as: 'divisions',
        });
    };

    return Team;
};
