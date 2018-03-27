const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/divisions', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of the divisions', async function() { 

        const genderName = 'some gender name';

        const gender = await this.db.Gender.create({ name: genderName });

        const divisions = await Promise.all(
            [...Array(1).keys()]
            .map((n) => ({
                name: `division name ${n}`,
                gender_id: gender.id,
            }))
            .map(data => this.db.Division.create(data))
        );

        const res = await request(this.app).get('/api/v1/divisions').expect(200);

        expect(res.body).to.deep.equal({
            divisions: divisions.map(division => ({
                id: division.id,
                name: division.name,
                gender: {
                    name: genderName,
                },
                _links: {
                    self: {
                        href: `${res.request.url}/${division.id}`
                    }
                }
            }))
        });

    });

});
