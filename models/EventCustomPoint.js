'use strict';
module.exports = (sequelize, DataTypes) => {
    const EventCustomPoint = sequelize.define('EventCustomPoint', {
        custom_point_id: DataTypes.INTEGER,
        event_id: DataTypes.INTEGER,
        points: DataTypes.INTEGER
    }, {
        tableName: 'events_custom_points'
    });
    return EventCustomPoint;
};
