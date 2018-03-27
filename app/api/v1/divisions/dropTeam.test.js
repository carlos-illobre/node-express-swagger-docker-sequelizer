const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('DELETE api/v1/divisions/:id/teams/:teamId/drop', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 401 if operator was not authenticated', async function() {
        const division = await this.db.Division.create({
            name: 'Origin Division',
            gender: {
                name: 'Male'
            },
            teams: [
                {
                    name: 'Team 1'
                }
            ]
        }, {
            include: [
                {
                    model: this.db.Gender,
                    as: 'gender'
                },
                {
                    model: this.db.Team,
                    as: 'teams'
                }

            ]
        });

        const teamId = division.teams[0].id;
        const divisionId = division.id;
        return request(this.app)
        .delete(`/api/v1/divisions/${divisionId}/teams/${teamId}/drop`)
        .expect(401);
    });

    it('return 201 if the team was drop by an authenticated operator', async function() {
        const division = await this.db.Division.create({
            name: 'Origin Division',
            gender: {
                name: 'Male'
            },
            teams: [
                {
                    name: 'Team 1'
                }
            ]
        }, {
            include: [
                {
                    model: this.db.Gender,
                    as: 'gender'
                },
                {
                    model: this.db.Team,
                    as: 'teams'
                }

            ]
        });

        const teamId = division.teams[0].id;
        const divisionId = division.id;
        const jwt = this.jwt;
        await request(this.app)
        .delete(`/api/v1/divisions/${divisionId}/teams/${teamId}/drop`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(204);

        const dcheck = await this.db.Division.findById(division.id, {
            include: [
                {
                    model: this.db.Team,
                    as: 'teams'
                }
            ]
        });
        expect(dcheck.teams.length).to.equal(0);
    });

});
