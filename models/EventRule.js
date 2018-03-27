'use strict';
module.exports = (sequelize, DataTypes) => {
    const EventRule = sequelize.define('EventRule', {
        rule_id: DataTypes.INTEGER,
        event_id: DataTypes.INTEGER,
        value: DataTypes.STRING,
        order: DataTypes.INTEGER,
        teams: DataTypes.INTEGER,
        created: DataTypes.DATE,
        modified: DataTypes.DATE,
        deleted: DataTypes.DATE
    }, {
        tableName: 'events_rules'
    });
    return EventRule;
};
