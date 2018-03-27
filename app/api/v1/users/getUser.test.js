const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/users/:id', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and a user', async function() { 
        
        const data = {
            first_name: 'some first name',
            last_name: 'some last name',
            email: 'some@email',
            phone: '555555555',
        };

        const user = await this.db.User.create(data);
        await user.addAdminRole();
        const res = await request(this.app).get(`/api/v1/users/${user.id}`).expect(200);

        return expect(res.body).to.deep.equal({
            ...data,
            roles: [{
                name: 'Admin',
            }],
            _links: {
                self: {
                    href: `${res.request.url}`
                }
            },
        });

    });

    it('return 404 if the user does not exist', function() { 
        return request(this.app)
        .get('/api/v1/users/45')
        .expect(404);
    });

    it('return 404 if the user id is not a number', function() { 
        return request(this.app)
        .get('/api/v1/users/xx')
        .expect(404);
    });

});
