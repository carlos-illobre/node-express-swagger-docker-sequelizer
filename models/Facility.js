module.exports = (sequelize, DataTypes) => {

    const Facility = sequelize.define('Facility', {
        name: DataTypes.STRING,
        abbreviation: DataTypes.STRING,
        street: DataTypes.STRING,
        city: DataTypes.STRING,
        zip: DataTypes.STRING,
        mapUrl: DataTypes.STRING,
    }, {
        tableName: 'facilities',
    });

    Facility.associate = (models) => {
        Facility.State = Facility.belongsTo(models.State, {as:'state'});
        Facility.Operator = Facility.belongsTo(models.Operator);
    };

    return Facility;

};
