'use strict';

module.exports = {

    up: async (queryInterface, Sequelize) => {
        const today = new Date().toISOString().slice(0, 10);
        await queryInterface.sequelize.query(`
            insert into users (email, created, modified) values
            ('admin@admin', '${today}', '${today}');
        `);
        const userId = await queryInterface.sequelize.query(`
            select id from users where email = 'admin@admin';
        `);
        const roleId = await queryInterface.sequelize.query(`
            select id from roles where name = 'Admin';
        `);
        await queryInterface.sequelize.query(`
            insert into users_roles (user_id, role_id, created, modified) values
            ('${userId[0][0].id}', '${roleId[0][0].id}', '${today}', '${today}');
        `);
    },

    down: async (queryInterface, Sequelize) => {
        const userId = await queryInterface.sequelize.query(`
            select id from users where email = 'admin@admin';
        `);
        await queryInterface.sequelize.query(`
            delete from users_roles where user_id = ${userId[0][0].id}
        `);
        await queryInterface.sequelize.query(`
            delete from users where id = ${userId[0][0].id}
        `);
    }

};
