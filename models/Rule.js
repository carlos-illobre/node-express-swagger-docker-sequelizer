'use strict';
module.exports = (sequelize, DataTypes) => {
    // Sequelize object
    const Rule = sequelize.define('Rule', {
        name: DataTypes.STRING,
        order: DataTypes.INTEGER,
        sport_id: DataTypes.INTEGER,
        values: DataTypes.TEXT,
        value: DataTypes.STRING,
        teams: DataTypes.INTEGER,
        created: DataTypes.DATE,
        modified: DataTypes.DATE,
        deleted: DataTypes.DATE
    }, {
        tableName: 'rules'
    });
    // Relationships setup
    Rule.associate = (models) => {
        Rule.Sport = Rule.belongsTo(models.Sport);
    };
    return Rule;
};
