module.exports = (sequelize, DataTypes) => {

    const Season = sequelize.define('Season', {
        name: DataTypes.STRING,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
    }, {
        tableName: 'seasons',
    });

    Season.associate = (models) => {
        Season.belongsTo(models.Operator);
    };

    return Season;
};
