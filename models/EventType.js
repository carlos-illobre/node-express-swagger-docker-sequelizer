module.exports = (sequelize, DataTypes) => {

    const EventType = sequelize.define('EventType', {
        name: DataTypes.STRING,
    }, {
        tableName: 'event_types',
    });

    return EventType;
    
};
