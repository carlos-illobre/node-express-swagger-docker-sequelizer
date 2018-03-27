module.exports = (sequelize, DataTypes) => {

    const Event = sequelize.define('Event', {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'The event name can not be empty',
                },
            },
        },
        start_date: {
            type: DataTypes.DATE,
        },
        end_date: {
            type: DataTypes.DATE,
        },
        image_url: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'events',
    });

    Event.associate = (models) => {
        Event.Operator = Event.belongsTo(models.Operator, { as: 'operator' });
        Event.Sport = Event.belongsTo(models.Sport, { as: 'sport' });
        Event.Rules = Event.belongsToMany(models.Rule, {
            through: models.EventRule
        });
        Event.CustomPoints = Event.belongsToMany(models.CustomPoint, {
            through: models.EventCustomPoint,
            foreignKey: 'event_id',
            as: 'customPoints',
        });
        Event.Teams = Event.belongsToMany(models.Team, {
            through: models.EventTeam,
            foreignKey: 'event_id',
            as: 'teams',
        });
        Event.Divisions = Event.hasMany(models.Division, { as: 'divisions' });
        Event.Facilities = Event.belongsToMany(models.Facility, {
            through: models.EventFacility,
            foreignKey: 'event_id',
            as: 'facilities',
        });
    };

    // Transaction Hooks Registry
    // Create Event Ruleset for Tiebreakers
    Event.afterCreate(async (event, options) => {
        const rules = await sequelize.models.OperatorRule.findAll();
        const bulkRules = rules.map((rule) => {
            return {
                rule_id: rule.rule_id,
                event_id: event.id,
                value: rule.value,
                order: rule.order,
                teams: rule.teams
            };
        });
        return await sequelize.models.EventRule.bulkCreate(bulkRules, {
            transaction: options.transaction,
        });
    });
    // Create Event Pointset for CustomPoints
    Event.afterCreate(async (event, options) => {
        const customPoints = await sequelize.models.CustomPoint.findAll();
        return await event.addCustomPoints(customPoints, { transaction: options.transaction });
    });

    return Event;
};
