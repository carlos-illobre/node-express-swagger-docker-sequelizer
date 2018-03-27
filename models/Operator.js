module.exports = (sequelize, DataTypes) => {

    const Operator = sequelize.define('Operator', {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        tableName: 'operators',
    });

    // Relationships setup
    Operator.associate = (models) => {
        Operator.Teams = Operator.belongsToMany(models.Team, {
            through: models.OperatorTeam,
            foreignKey: 'operator_id',
            as: 'Teams'
        });

        Operator.Rules = Operator.belongsToMany(models.Rule, {
            through: models.OperatorRule
        });
    };

    // Transaction Hooks Registry
    // Create Operator Ruleset for Tiebreakers
    Operator.afterCreate((operator, options, cb) => {
        return sequelize.models.Rule.findAll()
        .then((rules) => {
            return rules.map((rule) => {
                return {
                    rule_id: rule.id,
                    operator_id: operator.id,
                    value: rule.value,
                    order: rule.order,
                    teams: rule.teams
                };
            });
        })
        .then((bulkRules) => sequelize.models.OperatorRule.bulkCreate(bulkRules));
    });
    // Create Operator Pointset for CustomPoints
    Operator.afterCreate((operator, options, cb) => {
        return sequelize.models.CustomPoint.findAll()
        .then((points) => {
            return points.map((point) => {
                return {
                    custom_point_id: point.id,
                    operator_id: operator.id,
                    points: point.points,

                };
            });
        })
        .then((bulkPoints) => sequelize.models.OperatorCustomPoint.bulkCreate(bulkPoints));
    });
    // Create Operator Details for Paage
    Operator.afterCreate((operator, options, cb) => {
        return sequelize.models.Page.findOne()
        .then((page) => {
            return {
                logo_1: page.logo_1,
                logo_2: page.logo_2,
                logo_3: page.logo_3,
                notes: page.notes,
                social_media: page.social_media,
                operator_id: operator.id
            };
        })
        .then((page) => sequelize.models.OperatorPage.create(page));
    });

    return Operator;

};
