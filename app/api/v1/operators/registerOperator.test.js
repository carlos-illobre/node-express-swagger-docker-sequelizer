const request = require('supertest');
const expect = require('chai').expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/operators', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 201 if the event was created', function() {

        const data = {
            name: 'some name',
            password: 'some password',
        };

        return request(this.app)
        .post('/api/v1/operators')
        .send(data)
        .expect(201)
        .then((res) => {
            expect(res.body.auth).to.be.true;
            expect(res.body.token).to.not.be.empty;
            expect(res.body.token).to.be.a('string');
            expect(res.header.location).to.exist;
            return res.header.location.split('/').pop();
        })
        .then((id) => {
            return this.db.Operator.findById(id);
        })
        .then((operator) => {
            expect(operator.name).to.equals(data.name);
        });

    });

    it('return 500 if no operators table', function() {
        this.db.Operator = null;

        return request(this.app)
        .post('/api/v1/operators')
        .expect(500);
    });
});
