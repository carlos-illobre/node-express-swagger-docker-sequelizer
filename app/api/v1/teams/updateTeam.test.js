const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PUT api/v1/teams/:id', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 401 if operator was not authenticated', function() {
        return this.db.Operator.findById(this.operator.id)
        .then(Operator => {
            return Operator.createTeam({
                name: 'Some Team'
            }, {
                through: {
                    active: true
                }
            });
        })
        .then(Team => {
            const teamId = Team.id;
            return request(this.app)
            .put(`/api/v1/teams/${teamId}`)
            .send({
                name: 'New Name'
            })
            .expect(401, {});
        });
    });

    it('return 201 if the team was updated by an authenticated operator', function() {
        return this.db.Operator.findById(this.operator.id)
        .then(Operator => {
            return Operator.createTeam({
                name: 'Some Team'
            }, {
                through: {
                    active: true
                }
            });
        })
        .then(Team => {
            const teamId = Team.id;
            const jwt = this.jwt;
            return request(this.app)
            .put(`/api/v1/teams/${teamId}`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({
                name: 'New Name'
            })
            .expect(204, {});
        });
    });

});
