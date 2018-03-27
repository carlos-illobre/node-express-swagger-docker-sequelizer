const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/operators/me/points', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of points', function() {

        return this.db.OperatorCustomPoint.findAll({
            attributes: ['custom_point_id', 'points', 'values', 'group']
        })
        .then((points) => {
            return points.map((point) => {
                return {
                    id: point.custom_point_id,
                    points: point.points,
                    values: JSON.parse(point.values),
                    group: point.group
                };
            });
        })
        .then((points) => {
            return request(this.app)
            .get('/api/v1/operators/me/points')
            .set('Authorization', `Bearer ${this.jwt}`)
            .expect(200);

        });

    });
});
