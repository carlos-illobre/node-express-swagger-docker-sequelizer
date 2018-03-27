module.exports = (sequelize, DataTypes) => {

    const EventFacility = sequelize.define('EventFacility', {
    }, {
        tableName: 'events_facilities',
    });

    EventFacility.associate = (models) => {
        EventFacility.belongsTo(models.Event);
        EventFacility.belongsTo(models.Facility);
    };

    return EventFacility;

};
