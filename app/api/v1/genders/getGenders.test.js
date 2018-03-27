const request = require('supertest');
const expect = require('chai').expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/genders', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of genders', function() {

        const genderNames = ['Boys', 'Girls', 'All'];

        return request(this.app)
        .get('/api/v1/genders')
        .expect(200)
        .then((res) => {
            expect(res.body.genders).to.exist;
            expect(res.body.genders.length).to.equal(genderNames.length);
            res.body.genders.map((gender) => {
                expect(gender.id).to.exist;
                expect(gender.name).to.exist;
                expect(gender._links).to.exist;
                expect(gender._links.self).to.exist;
                expect(gender._links.self.href).to.exist;
                expect(genderNames.indexOf(gender.name)).to.not.equal(-1);
            });
        });

    });

});
