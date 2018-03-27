const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/users', function () {

    beforeEach(async function() {
        await createTestApp(this);
    });

    it('return 201 if the user was created by an authenticated admin user', async function() {

        const data = {
            first_name: 'Gigi',
            last_name: 'Lemon',
            email: 'some@email',
            phone: '23434545',
        };

        const res = await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.adminJwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;
        const id = res.header.location.split('/').pop();
        expect(res.header.location).to.equal(`${res.request.url}/${id}`);
        expect(res.body).to.deep.equal({
            id: parseInt(id),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const user = await this.db.User.findById(id);

        expect(user).to.include({
            ...data,
        });

    });

    it('return 401 if the user was not authenticated', async function() {

        const originalCount = await this.db.User.count();

        await request(this.app)
        .post('/api/v1/users')
        .expect(401, {});

        const newCount = await this.db.User.count();
        
        expect(originalCount).to.equals(newCount);

    });

    it('return 401 if the user is not admin', async function() {

        const originalCount = await this.db.User.count();

        await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(401, {
            error: 'This is an Administrator only resource.',
        });

        const newCount = await this.db.User.count();
        
        expect(originalCount).to.equals(newCount);

    });

});
