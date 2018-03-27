const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/points', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of points', function() {

        return this.db.CustomPoint.findAll({
            attributes: ['id', 'name', 'points', 'values', 'group']
        })
        .then((points) => {
            return request(this.app)
            .get('/api/v1/points')
            .expect(200);

        });

    });
});
