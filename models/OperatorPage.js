'use strict';
module.exports = (sequelize, DataTypes) => {
    const OperatorPage = sequelize.define('OperatorPage', {
        logo_1: DataTypes.TEXT,
        logo_2: DataTypes.TEXT,
        logo_3: DataTypes.TEXT,
        notes: DataTypes.TEXT,
        social_media: DataTypes.STRING,
        operator_id: DataTypes.INTEGER
    }, {
        tableName: 'operators_page'
    });
    return OperatorPage;
};
