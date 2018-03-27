'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tiebreakers_rules', {
            rule_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'rules',
                    key: 'id'
                }
            },
            tiebreaker_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'tiebreakers',
                    key: 'id'
                }
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('tiebreakers_rules');
    }
};
