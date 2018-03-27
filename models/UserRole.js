module.exports = (sequelize, DataTypes) => {

    const UserRole = sequelize.define('UserRole', {
    }, {
        tableName: 'users_roles',
    });

    UserRole.associate = (models) => {
        UserRole.User = UserRole.belongsTo(models.User);
        UserRole.Role = UserRole.belongsTo(models.Role);
    };

    return UserRole;

};
