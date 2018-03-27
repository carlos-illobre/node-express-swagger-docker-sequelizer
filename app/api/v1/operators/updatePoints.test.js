const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PUT api/v1/operators/me/points', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 204 if points were updated', function() {
        return request(this.app)
        .put('/api/v1/operators/me/points')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send([{
            id: 1,
            points: 2,
            values: {}
        }])
        .expect(204, {});
    });

    it('Do not update pointset if point does not exists', function() {

        return request(this.app)
        .put('/api/v1/operators/me/points')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send([{
            id: 99,
            points: 2,
            values: {}
        }])
        .expect(204, {});
    });
});
