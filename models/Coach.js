'use strict';
module.exports = (sequelize, DataTypes) => {
    // Sequelize object
    const Coach = sequelize.define('Coach', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        registration_id: DataTypes.INTEGER,
        external_coach_id: DataTypes.INTEGER,
    }, {
        tableName: 'coaches'
    });
    // Relationships setup
    Coach.associate = (models) => {
        Coach.RegistrationSystem = Coach.belongsTo(models.RegistrationSystem, {
            foreignKey: 'registration_id'
        });
        Coach.Teams = Coach.hasMany(models.Team, {
            foreignKey: 'coach_id'
        });
    };

    return Coach;
};
