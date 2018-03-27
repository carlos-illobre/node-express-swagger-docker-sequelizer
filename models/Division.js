module.exports = (sequelize, DataTypes) => {

    const Division = sequelize.define('Division', {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'The division name can not be empty',
                },
            },
        },
        abbreviation: {
            type: DataTypes.STRING,
        },
        skill: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'divisions',
    });

    Division.associate = (models) => {
        Division.Gender = Division.belongsTo(models.Gender, { as: 'gender' });
        Division.Teams = Division.belongsToMany(models.Team, {
            through: models.DivisionTeam,
            as: 'teams'
        });
        Division.Event = Division.belongsTo(models.Event, {as: 'event'});
    };

    Division.generateAbbreviation = ({
        name,
        gender,
        skill = '',
    }) => {
        return `${name[0]}${gender[0]}${skill && skill[0]}`;
    };

    Division.prototype.generateAbbreviation = async function() {
        const gender = this.gender || await this.getGender();
        this.abbreviation = Division.generateAbbreviation({
            name: this.name,
            skill: this.skill,
            gender: gender.name,
        });
        return this;
    };

    Division.beforeCreate(async (division, options) => {
        if (!division.abbreviation) await division.generateAbbreviation();
    });

    return Division;

};
