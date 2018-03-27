const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/tiebreakers', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 201 if the rule was created by an authenticated admin', function() {
        return request(this.app)
        .post('/api/v1/tiebreakers')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send({
            name: 'Test rule',
            values: {},
            value: 1,
            sport_id: 1,
            teams: 1,
            order: 0
        })
        .expect(201);
    });

    it('return 401 if admin was not authenticated', function() {
        return request(this.app)
        .post('/api/v1/tiebreakers')
        .send({
            name: 'Test rule',
            values: {},
            value: 1,
            sport_id: 1,
            teams: 1,
            order: 0
        })
        .expect(401);
    });
});
