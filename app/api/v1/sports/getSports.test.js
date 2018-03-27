const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/sports', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of sports', function() {

        return this.db.Sport.findAll()
        .then((sports) => {

            return request(this.app)
            .get('/api/v1/sports')
            .expect(200, {
                sports: sports.map((sport) => {

                    return {
                        id: sport.id,
                        name: sport.name,
                    };

                })
            });

        });

    });

    it('return 500 if no sports table', function() {

        this.db.Sport = null;

        return request(this.app)
        .get('/api/v1/sports')
        .expect(500);

    });

});
