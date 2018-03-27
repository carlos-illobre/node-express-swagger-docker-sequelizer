const request = require('supertest');
const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);
const generateOperatorJwt = require('./api/v1/operators/generateOperatorJwt.js');

describe('Create Passport', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 401 if the token expired', function() {
        const expiredJwt = generateOperatorJwt({
            id: 'xxx',
        });
        return request(this.app)
        .put('/api/v1/events/1/tiebreaker')
        .set('Authorization', `Bearer ${expiredJwt}`)
        .expect(401, {});
    });

});
