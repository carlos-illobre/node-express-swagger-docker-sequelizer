const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PUT api/v1/operators/me/tiebreakers', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 204 if rules were updated', function() {
        return request(this.app)
        .put('/api/v1/operators/me/tiebreakers')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send([{
            id: 1,
            value: 2,
            teams: 2,
            order: 1
        }])
        .expect(204, {});
    });

    it('Do not update ruleset if rule does not exists', function() {

        return request(this.app)
        .put('/api/v1/operators/me/tiebreakers')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send([{
            id: 99,
            value: 2,
            teams: 2,
            order: 1
        }])
        .expect(204, {});
    });
});
