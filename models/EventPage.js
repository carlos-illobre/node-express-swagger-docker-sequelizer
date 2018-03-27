'use strict';
module.exports = (sequelize, DataTypes) => {
    const EventPage = sequelize.define('EventPage', {
        logo_1: DataTypes.TEXT,
        logo_2: DataTypes.TEXT,
        logo_3: DataTypes.TEXT,
        notes: DataTypes.TEXT,
        social_media: DataTypes.STRING,
        event_id: DataTypes.INTEGER
    }, {
        tableName: 'events_page'
    });
    return EventPage;
};
