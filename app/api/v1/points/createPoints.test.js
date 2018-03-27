const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/points', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 201 if the point was created by an authenticated admin', function() {
        const data = {
            name: 'Test point',
            values: {},
            points: 1,
            group: 4
        };
        return request(this.app)
        .post('/api/v1/points')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);
    });

    it('return 401 if admin was not authenticated', function() {
        const data = {
            name: 'Test point',
            values: {},
            points: 1,
            group: 4
        };
        return request(this.app)
        .post('/api/v1/points')
        .send(data)
        .expect(401);
    });
});
