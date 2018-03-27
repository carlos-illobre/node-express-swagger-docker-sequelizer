'use strict';
module.exports = (sequelize, DataTypes) => {
    // Sequelize object
    const RegistrationSystem = sequelize.define('RegistrationSystem', {
        name: DataTypes.STRING
    }, {
        tableName: 'registration_systems'
    });
    // Relationships setup
    RegistrationSystem.associate = (models) => {
        RegistrationSystem.Coaches = RegistrationSystem.hasMany(models.Coach, {
            foreignKey: 'registration_id'
        });
        RegistrationSystem.Teams = RegistrationSystem.hasMany(models.Team, {
            foreignKey: 'registration_id'
        });
    };

    return RegistrationSystem;
};
