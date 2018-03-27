'use strict';
module.exports = (sequelize, DataTypes) => {
    const OperatorCustomPoint = sequelize.define('OperatorCustomPoint', {
        custom_point_id: DataTypes.INTEGER,
        operator_id: DataTypes.INTEGER,
        points: DataTypes.INTEGER,
        values: DataTypes.TEXT,
        group: DataTypes.INTEGER
    }, {
        tableName: 'operators_custom_points'
    });
    return OperatorCustomPoint;
};
