// Default points.
const points = [
    { name: 'Points for a Win', values: {}, points: 3 },
    { name: 'Points for a Tie', values: {}, points: 1 },
    { name: 'Points for a Loss', values: {}, points: 0 },
    { name: 'Points Per Goal', values: {}, points: 0 },
    { name: 'Maximum Points Per Goal', values: {}, points: 0 },
    { name: 'Points for a Shoutout', values: {}, points: 0 },
];

module.exports = {
    up: (queryInterface, Sequelize) => {
        // Model
        const CustomPoint = queryInterface.sequelize.import('../models/CustomPoint.js');
        // Starting loop.
        return points.reduce((promise, point) => {
            return promise.then(() => CustomPoint.findOrCreate({
                where : {
                    name: point.name,
                    values: JSON.stringify(point.values),
                    points: point.points
                }
            }));
        }, Promise.resolve());
    },

    down: (queryInterface, Sequelize) => {
        // Model
        const CustomPoint = queryInterface.sequelize.import('../models/CustomPoint.js');
        return CustomPoint.destroy({
            force: true,
            truncate: true
        });
    }
};
