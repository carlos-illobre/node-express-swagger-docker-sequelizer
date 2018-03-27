'use strict';
module.exports = (sequelize, DataTypes) => {
    // Sequelize object
    const DivisionTeam = sequelize.define('DivisionTeam', {
        division_id: DataTypes.INTEGER,
        team_id: DataTypes.INTEGER,
        active: DataTypes.BOOLEAN
    }, {
        tableName: 'divisions_teams'
    });
    // Relationships setup
    DivisionTeam.associate = (models) => {
        DivisionTeam.Division = DivisionTeam.belongsTo(models.Division);
        DivisionTeam.Team = DivisionTeam.belongsTo(models.Team);
    };

    return DivisionTeam;
};
