module.exports = (sequelize, DataTypes) => {

    const EventTeam = sequelize.define('EventTeam', {
    }, {
        tableName: 'events_teams',
    });

    EventTeam.associate = (models) => {
        EventTeam.Event = EventTeam.belongsTo(models.Event);
        EventTeam.Team = EventTeam.belongsTo(models.Team);
    };

    return EventTeam;

};
