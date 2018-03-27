const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/page/details', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 204 if details were updated', function() {
        return request(this.app)
        .post('/api/v1/page/details')
        .set('Authorization', `Bearer ${this.jwt}`)
        .attach('logo_1', 'app/api/v1/page/logo1.jpeg')
        .attach('logo_2', 'app/api/v1/page/logo2.jpeg')
        .attach('logo_3', 'app/api/v1/page/logo3.jpeg')
        .field('social_media', '@primetimesportz')
        .field('notes', 'Random notes')
        .expect(204, {});
    });

    it('return 401 if admin was not authenticated', function() {
        return request(this.app)
        .post('/api/v1/page/details')
        .attach('logo_1', 'app/api/v1/page/logo1.jpeg')
        .attach('logo_2', 'app/api/v1/page/logo2.jpeg')
        .attach('logo_3', 'app/api/v1/page/logo3.jpeg')
        .field('social_media', '@primetimesportz')
        .field('notes', 'Random notes')
        .expect(401);
    });
});
