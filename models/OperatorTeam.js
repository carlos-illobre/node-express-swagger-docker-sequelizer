'use strict';
module.exports = (sequelize, DataTypes) => {
    // Sequelize object
    const OperatorTeam = sequelize.define('OperatorTeam', {
        operator_id: DataTypes.INTEGER,
        team_id: DataTypes.INTEGER,
        active: DataTypes.BOOLEAN
    }, {
        tableName: 'operators_teams'
    });
    // Relationships setup
    OperatorTeam.associate = (models) => {
        OperatorTeam.Team = OperatorTeam.belongsTo(models.Team);
        OperatorTeam.Operator = OperatorTeam.belongsTo(models.Operator);
    };

    return OperatorTeam;
};
