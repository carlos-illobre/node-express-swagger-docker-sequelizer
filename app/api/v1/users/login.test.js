const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const jwt = require('jsonwebtoken');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/users/login', function () {

    beforeEach(async function() {
        await createTestApp(this);
    });

    it('return 201 if the login was successful', async function() {

        const data = {
            email: this.admin.email,
            password: '23434545',
        };

        const res = await request(this.app)
        .post('/api/v1/users/login')
        .send(data)
        .expect(201);

        expect(res.body.auth).to.be.true;
        const decoded = jwt.verify(res.body.token, process.env.JWT_SEED);
        expect(decoded.sub).to.deep.equal({
            id: this.admin.id,
        });

    });

    it('return 401 if user not found', async function() {

        const data = {
            email: this.admin.email + 'other',
            password: '23434545',
        };

        await request(this.app)
        .post('/api/v1/users/login')
        .send(data)
        .expect(401);

    });

});
