module.exports = (sequelize, DataTypes) => {

    const Sport = sequelize.define('Sport', {
        name: DataTypes.STRING,
    }, {
        tableName: 'sports',
    });

    return Sport;

};
