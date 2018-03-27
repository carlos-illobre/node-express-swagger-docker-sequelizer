const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PATCH api/v1/divisions/:id/combine/:target', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 401 if operator was not authenticated', async function() {
        const [origin, target] = await Promise.all([
            this.db.Division.create({
                name: 'Origin Division',
                gender: { name: 'Male' },
                event: {
                    name: 'Test event!',
                    start_date: new Date(),
                    end_date: new Date(),
                    sport_id: 1,
                    image_url: 'https://placekitten.com/300/300',
                    operator_id: this.operator.id
                },
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
                }, {
                    model: this.db.Event,
                    as: 'event'
                }]
            }),
            this.db.Division.create({
                name: 'Target Division',
                event_id: 1,
                gender: { name: 'Female' }
            }, {
                include: [{
                    model: this.db.Gender,
                    as: 'gender'
                }]
            })
        ]);
        return request(this.app)
        .patch(`/api/v1/divisions/${origin.id}/combine/${target.id}`)
        .expect(401, {});
    });

    it('return 402 if origin and target divisions are not in the same event', async function() {
        const [origin, target] = await Promise.all([
            this.db.Division.create({
                name: 'Origin Division',
                gender: { name: 'Male' },
                event: {
                    name: 'Test event!',
                    start_date: new Date(),
                    end_date: new Date(),
                    sport_id: 1,
                    image_url: 'https://placekitten.com/300/300',
                    operator_id: this.operator.id
                },
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
                }, {
                    model: this.db.Event,
                    as: 'event'
                }]
            }),
            this.db.Division.create({
                name: 'Target Division',
                event: {
                    name: 'Test event 2!',
                    start_date: new Date(),
                    end_date: new Date(),
                    sport_id: 1,
                    image_url: 'https://placekitten.com/300/300',
                    operator_id: this.operator.id
                },
                gender: { name: 'Female' }
            }, {
                include: [{
                    model: this.db.Gender,
                    as: 'gender'
                }, {
                    model: this.db.Event,
                    as: 'event'
                }]
            })
        ]);
        return request(this.app)
        .patch(`/api/v1/divisions/${origin.id}/combine/${target.id}`)
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(422);
    });

    it('return 201 if the teams were moved by an authenticated operator', async function() {
        const [origin, target] = await Promise.all([
            this.db.Division.create({
                name: 'Origin Division',
                gender: { name: 'Male' },
                event: {
                    name: 'Test event!',
                    start_date: new Date(),
                    end_date: new Date(),
                    sport_id: 1,
                    image_url: 'https://placekitten.com/300/300',
                    operator_id: this.operator.id
                },
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
                }, {
                    model: this.db.Event,
                    as: 'event'
                }]
            }),
            this.db.Division.create({
                name: 'Target Division',
                event_id: 1,
                gender: { name: 'Female' }
            }, {
                include: [{
                    model: this.db.Gender,
                    as: 'gender'
                }]
            })
        ]);

        await request(this.app)
        .patch(`/api/v1/divisions/${origin.id}/combine/${target.id}`)
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(204);
        const division = await this.db.Division.findById(target.id, {
            include: [
                {
                    model: this.db.Team,
                    as: 'teams'
                }
            ]
        });
        expect(division.teams.length).to.equal(2);
    });

});
