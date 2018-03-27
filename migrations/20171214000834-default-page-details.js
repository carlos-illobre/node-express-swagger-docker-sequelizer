'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // Model
        const Page = queryInterface.sequelize.import('../models/Page.js');
        return Page.create({
            logo_1: 'logo1.jpeg',
            logo_2: 'logo2.jpeg',
            logo_3: 'logo3.jpeg',
            notes: 'These are sample notes',
            social_media: '@primetimesportz'
        });
    },

    down: (queryInterface, Sequelize) => {
        // Model
        const Page = queryInterface.sequelize.import('../models/Page.js');
        return Page.destroy({
            force: true,
            trucate: true
        });
    }
};
