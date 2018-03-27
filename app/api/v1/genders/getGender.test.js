const request = require('supertest');
const expect = require('chai').expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/gender/:id', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the the gender', function() {
        return this.db.Gender.create({
            name: 'Girls',
        })
        .then(gender => Promise.all([
            gender,
            request(this.app).get(`/api/v1/genders/${gender.id}`).expect(200)
        ]))
        .then(([gender, res]) => {
            expect(res.body).to.deep.equal({
                id: gender.id,
                name: gender.name,
                _links: {
                    self: {
                        href: res.request.url,
                    },
                },
            });
        });
    });

    it('return 404 if the gender does not exist', function() { 
        return request(this.app)
        .get('/api/v1/genders/45')
        .expect(404);
    });

});
