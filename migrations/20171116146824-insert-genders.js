'use strict';

module.exports = {

    up: (queryInterface, Sequelize) => {

        const today = new Date().toISOString().slice(0, 10);

        return queryInterface.sequelize.query(`
            insert into genders (name, created, modified) values
            ('Girls', '${today}', '${today}'),
            ('Boys', '${today}', '${today}'),
            ('All', '${today}', '${today}');
        `);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(`
            delete from genders where name in (
                'Girls',
                'Boys',
                'All'
            );
        `);
    }

};
