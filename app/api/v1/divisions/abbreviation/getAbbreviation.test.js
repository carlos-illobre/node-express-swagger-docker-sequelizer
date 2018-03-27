const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/divisions/abbreviation', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the division abbreviation', function() {
        return request(this.app)
        .get('/api/v1/divisions/abbreviation?name=3rd&gender=Boys&skill=Develomental')
        .expect(200, {
            abbreviation: '3BD',
        });
    });

});
