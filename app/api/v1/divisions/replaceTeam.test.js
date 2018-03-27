const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/divisions/:id/teams/:teamId/replace', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 401 if operator was not authenticated', async function() {
        const division = await this.db.Division.create({
            name: 'Origin Division',
            gender: { name: 'Male' },
            teams: [{
                name: 'Team 1'
            }],
        }, {
            include: [{
                model: this.db.Gender,
                as: 'gender',
            }, {
                model: this.db.Team,
                as: 'teams',
            }]
        });
        const team = await this.db.Team.create({
            name: 'Team 2'
        });
        const teamId = division.teams[0].id;
        return request(this.app)
        .post(`/api/v1/divisions/${division.id}/teams/${teamId}/replace`)
        .send({
            teamId: team.id
        })
        .expect(401, {});
    });

    it('return 201 if the teams were moved by an authenticated operator', async function() {
        const division = await this.db.Division.create({
            name: 'Origin Division',
            gender: { name: 'Male' },
            teams: [{
                name: 'Team 1'
            }]
        }, {
            include: [{
                model: this.db.Gender,
                as: 'gender'
            }, {
                model: this.db.Team,
                as: 'teams'
            }]
        });
        const team = await this.db.Team.create({
            name: 'Team 2'
        });
        const teamId = division.teams[0].id;
        const divisionId = division.id;
        const jwt = this.jwt;
        return request(this.app)
        .post(`/api/v1/divisions/${divisionId}/teams/${teamId}/replace`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
            teamId: team.id
        })
        .expect(201, {});
    });

});
