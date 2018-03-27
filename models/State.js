module.exports = (sequelize, DataTypes) => {

    const State = sequelize.define('State', {
        name: DataTypes.STRING,
        abbreviation: DataTypes.STRING,
    }, {
        tableName: 'states',
    });

    return State;

};
