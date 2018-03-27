module.exports = (sequelize, DataTypes) => {

    const Gender = sequelize.define('Gender', {
        name: DataTypes.STRING,
    }, {
        tableName: 'genders',
    });

    return Gender;

};
