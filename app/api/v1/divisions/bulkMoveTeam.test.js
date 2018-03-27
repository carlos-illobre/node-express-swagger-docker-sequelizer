const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PATCH api/v1/divisions/:id/move', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 401 if operator was not authenticated', async function() {
        const [origin, destiny] = await Promise.all([
            this.db.Division.create({
                name: 'Origin Division',
                gender: { name: 'Male' },
                teams: [
                    { name: 'Team 1' },
                    { name: 'Team 2' },
                ]
            }, {
                include: [{
                    model: this.db.Gender,
                    as: 'gender'
                }, {
                    model: this.db.Team,
                    as: 'teams'
                }]
            }),
            this.db.Division.create({
                name: 'Destiny Division',
                gender: { name: 'Female' }
            }, {
                include: [{
                    model: this.db.Gender,
                    as: 'gender'
                }]
            })
        ]);
        const teams = origin.teams.map(team => team.id);
        return request(this.app)
        .patch(`/api/v1/divisions/${destiny.id}/move`)
        .send({ teams })
        .expect(401, {});
    });

    it('return 201 if the teams were moved by an authenticated operator', async function() {
        const [origin, destiny] = await Promise.all([
            this.db.Division.create({
                name: 'Origin Division',
                gender: { name: 'Male' },
                teams: [{
                    name: 'Team 1'
                },
                {
                    name: 'Team 2'
                }]
            }, {
                include: [{
                    model: this.db.Gender,
                    as: 'gender'
                }, {
                    model: this.db.Team,
                    as: 'teams'
                }]
            }),
            this.db.Division.create({
                name: 'Destiny Division',
                gender: { name: 'Female' }
            }, {
                include: [{
                    model: this.db.Gender,
                    as: 'gender'
                }]
            })
        ]);
        const teams = origin.teams.map(team => team.id);
        return request(this.app)
        .patch(`/api/v1/divisions/${destiny.id}/move`)
        .set('Authorization', `Bearer ${this.jwt}`)
        .send({ teams })
        .expect(204, {});
    });

});
