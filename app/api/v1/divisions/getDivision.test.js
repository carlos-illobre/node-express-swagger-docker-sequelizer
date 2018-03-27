const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/divisions/:id', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and a division', async function() { 

        const genderName = 'some gender name';

        const gender = await this.db.Gender.create({ name: genderName });

        const division = await this.db.Division.create({
            name: 'some division name',
            gender_id: gender.id,
        });

        const res = await request(this.app).get(`/api/v1/divisions/${division.id}`).expect(200);

        expect(res.body).to.deep.equal({
            id: division.id,
            name: division.name,
            gender: {
                name: genderName,
            },
            _links: {
                self: {
                    href: `${res.request.url}`
                }
            }
        });

    });

    it('return 404 if the division does not exist', function() { 
        return request(this.app)
        .get('/api/v1/divisions/45')
        .expect(404);
    });

    it('return 404 if the division id is not a number', function() { 
        return request(this.app)
        .get('/api/v1/divisions/xx')
        .expect(404);
    });

});
