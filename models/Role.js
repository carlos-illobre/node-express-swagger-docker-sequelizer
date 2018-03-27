module.exports = (sequelize, DataTypes) => {

    const Role = sequelize.define('Role', {
        name: DataTypes.STRING,
    }, {
        tableName: 'roles',
    });

    Role.adminRoleName = 'Admin';

    Role.getAdminRole = function() {
        return Role.findOne({
            where: {
                name: Role.adminRoleName,
            },
        });
    };

    return Role;

};
