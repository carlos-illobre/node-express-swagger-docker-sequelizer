'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('custom_points_sport')
        .then(() => queryInterface.dropTable('custom_points_event'))
        .then(() => queryInterface.createTable('operators_custom_points', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            custom_point_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'custom_points',
                    key: 'id'
                }
            },
            operator_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'operators',
                    key: 'id'
                }
            },
            points: {
                type: Sequelize.INTEGER
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted: {
                type: Sequelize.DATE,
            }
        })
        )
        .then(() => queryInterface.createTable('events_custom_points', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            custom_point_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'custom_points',
                    key: 'id'
                }
            },
            event_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'events',
                    key: 'id'
                }
            },
            points: {
                type: Sequelize.INTEGER
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted: {
                type: Sequelize.DATE,
            }
        })
        )
        .then(() => queryInterface.removeColumn('custom_points', 'operator_id'))
        .then(() => queryInterface.addColumn('custom_points', 'values', {
            type: Sequelize.TEXT
        }))

        .then(() => queryInterface.addColumn('custom_points', 'points', {
            type: Sequelize.INTEGER
        }));
    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.removeColumn('custom_points', 'values')
        .then(() => queryInterface.removeColumn('custom_points', 'points'))
        .then(() => queryInterface.addColumn('custom_points', 'operator_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'operators',
                key: 'id'
            }
        }))
        .then(() => queryInterface.dropTable('events_custom_points'))
        .then(() => queryInterface.dropTable('operators_custom_points'))
        .then(() => queryInterface.createTable('custom_points_event', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            custom_point_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'custom_points',
                    key: 'id'
                }
            },
            event_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'events',
                    key: 'id'
                }
            },
            points: {
                type: Sequelize.INTEGER
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted: {
                type: Sequelize.DATE,
            }
        })
        )
        .then(() => queryInterface.createTable('custom_points_sport', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            custom_point_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'custom_points',
                    key: 'id'
                }
            },
            sport_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'sports',
                    key: 'id'
                }
            },
            points: {
                type: Sequelize.INTEGER
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted: {
                type: Sequelize.DATE,
            }
        })
        );
    }
};
