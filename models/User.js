module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
    }, {
        tableName: 'users',
    });

    User.associate = (models) => {
        User.Roles = User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: 'user_id',
            as: 'roles',
        });
        User.Role = User.Roles.target;
    };

    User.prototype.addAdminRole = async function() {
        const adminRole = await User.Role.getAdminRole();
        await this.addRole(adminRole);
        return this;
    };

    User.prototype.isAdmin = async function() {
        await this.reload({
            include: [{
                model: User.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });
        return this.roles.find(role => role.name == User.Role.adminRoleName);
    };

    return User;

};
