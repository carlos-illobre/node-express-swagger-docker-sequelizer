const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('DELETE api/v1/users/:id', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 204 and delete the user', async function() {

        const user = await this.db.User.create({
            first_name: 'some first name',
            last_name: 'some last name',
            email: 'some@email',
            phone: '555555555',
        });
        await user.addAdminRole();

        await request(this.app)
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${this.adminJwt}`)
        .expect(204, {});

        const result = await this.db.User.findById(user.id);
        expect(result).to.be.null;

    });

    it('return 404 if the user does not exist', function() { 
        return request(this.app)
        .delete('/api/v1/users/45')
        .set('Authorization', `Bearer ${this.adminJwt}`)
        .expect(404);
    });

    it('return 404 if the user id is not a number', function() { 
        return request(this.app)
        .delete('/api/v1/users/xx')
        .set('Authorization', `Bearer ${this.adminJwt}`)
        .expect(404);
    });

    it('return 401 if the user was not authenticated', async function() {

        const user = await this.db.User.create({
            first_name: 'some first name',
            last_name: 'some last name',
            email: 'some@email',
            phone: '555555555',
        });
        await user.addAdminRole();

        await request(this.app)
        .delete(`/api/v1/users/${user.id}`)
        .expect(401);

        const result = await this.db.User.findById(user.id);
        expect(result).to.exist;

    });

    it('return 401 if the user is not admin', async function() {

        const user = await this.db.User.create({
            first_name: 'some first name',
            last_name: 'some last name',
            email: 'some@email',
            phone: '555555555',
        });
        await user.addAdminRole();

        await request(this.app)
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(401, {
            error: 'This is an Administrator only resource.',
        });

        const result = await this.db.User.findById(user.id);
        expect(result).to.exist;

    });

});
