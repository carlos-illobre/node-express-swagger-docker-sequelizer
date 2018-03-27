'use strict';
module.exports = (sequelize, DataTypes) => {
    const Page = sequelize.define('Page', {
        logo_1: DataTypes.TEXT,
        logo_2: DataTypes.TEXT,
        logo_3: DataTypes.TEXT,
        notes: DataTypes.TEXT,
        social_media: DataTypes.STRING
    }, {
        tableName: 'pages',
    });
    return Page;
};
