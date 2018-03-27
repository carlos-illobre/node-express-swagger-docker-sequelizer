const request = require('supertest');
const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('Create Express Application', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('Returns 404 if the url does not exist', function() {
        return request(this.app)
        .get('/some/invalid/url')
        .expect(404, {});
    });

});
