'use strict';
module.exports = (sequelize, DataTypes) => {
    const OperatorRule = sequelize.define('OperatorRule', {
        rule_id: DataTypes.INTEGER,
        operator_id: DataTypes.INTEGER,
        value: DataTypes.STRING,
        order: DataTypes.INTEGER,
        teams: DataTypes.INTEGER,
        created: DataTypes.DATE,
        modified: DataTypes.DATE,
        deleted: DataTypes.DATE
    }, {
        tableName: 'operators_rules'
    });
    return OperatorRule;
};
