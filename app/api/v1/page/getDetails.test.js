const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/page/details', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and page details', function() {
        return this.db.Page.findOne()
        .then((page) => {
            return request(this.app)
            .get('/api/v1/page/details')
            .expect(200);
        });
    });
});
