const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));
const expect = chai.expect;
const _ = require('lodash');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/events', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 201 if the event was created with an existent team using an authenticated operator', async function() {

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        await this.db.Team.create({
            external_team_id: 90,
            name: 'some team name',
        });

        const data = {
            sport: {
                id: sport.id,
            },
            name: 'some event name',
            dates: {
                start: new Date(),
                end: new Date(),
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
            teams: [{
                external_team_id: 90,
                name: 'some team name',
            }],
            divisions: [{
                name: 'some division name',
                abbreviation: 'XX',
                skill: 'some skill',
                gender: {
                    id: 1,
                },
                teams: [{
                    external_team_id: 90,
                }],
            }],
            facilities: [{
                name: 'facility name',
                abbreviation: 'YY',
                street: 'some street',
                city: 'come city',
                zip: 'some zip',
                state: {
                    name: 'state name',
                    abbreviation: 'TT',
                },
                map: {
                    url: 'http://www.someurl.com',
                },
            }],
        };

        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const eventId = res.header.location.split('/').pop();
        expect(res.header.location).to.equal(`${res.request.url}/${eventId}`);

        expect(res.body).to.deep.equal({
            id: parseInt(eventId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const event = await this.db.Event.findById(eventId, {
            include: [{
                model: this.db.Operator,
                as: 'operator',
                attributes: [ 'id' ],
            }, {
                model: this.db.Sport,
                as: 'sport',
                attributes: [ 'id' ],
            }, {
                model: this.db.Team,
                as: 'teams',
                include: [
                    {
                        model: this.db.Division,
                        as: 'divisions',
                        include: [{
                            model: this.db.Gender,
                            as: 'gender',
                        }]
                    }
                ],
            }, {
                model: this.db.Division,
                as: 'divisions',
            }, {
                model: this.db.Facility,
                as: 'facilities',
                include: [{
                    model: this.db.State,
                    as: 'state',
                }]
            }],
        });

        expect({
            sport: {
                id: event.sport.id,
            },
            name: event.name,
            image: {
                url: event.image_url,
            },
            teams: event.teams.map(team => ({
                external_team_id: team.external_team_id,
                name: team.name,
            })),
            divisions: event.teams.map(team => ({
                name: team.divisions[0].name,
                abbreviation: team.divisions[0].abbreviation,
                skill: team.divisions[0].skill,
                gender: {
                    id: team.divisions[0].gender.id,
                },
                teams: [{
                    external_team_id: team.external_team_id,
                }],
            })),
            facilities: event.facilities.map(facility => ({
                name: facility.name,
                abbreviation: facility.abbreviation,
                street: facility.street,
                city: facility.city,
                zip: facility.zip,
                state: {
                    name: facility.state.name,
                    abbreviation: facility.state.abbreviation,
                },
                map: {
                    url: facility.mapUrl,
                },
            })),
        }).to.deep.equal(_.omit(data, ['dates']));

        expect(event.divisions.length).to.equal(data.divisions.length);

        expect(new Date(event.start_date)).to.equalDate(data.dates.start);
        expect(new Date(event.end_date)).to.equalDate(data.dates.end);
    });

    it('return 201 if the event was created by an authenticated operator', async function() {

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const data = {
            sport: {
                id: sport.id,
            },
            name: 'some event name',
            dates: {
                start: new Date(),
                end: new Date(),
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
            teams: [{
                external_team_id: 90,
                name: 'some team name',
                external_coach_id: 900,
            }],
            divisions: [{
                name: 'some division name',
                abbreviation: 'XX',
                skill: 'some skill',
                gender: {
                    id: 1,
                },
                teams: [{
                    external_team_id: 90,
                }],
            }],
            coaches: [{
                external_coach_id: 900,
                first_name: 'coach first name',
                last_name: 'coach last name',
                email: 'coach@email',
                phone: '99999999',
            }],
            facilities: [{
                name: 'facility name',
                abbreviation: 'YY',
                street: 'some street',
                city: 'come city',
                zip: 'some zip',
                state: {
                    name: 'state name',
                    abbreviation: 'TT',
                },
                map: {
                    url: 'http://www.someurl.com',
                },
            }],
        };

        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const eventId = res.header.location.split('/').pop();
        expect(res.header.location).to.equal(`${res.request.url}/${eventId}`);

        expect(res.body).to.deep.equal({
            id: parseInt(eventId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const event = await this.db.Event.findById(eventId, {
            include: [{
                model: this.db.Operator,
                as: 'operator',
                attributes: [ 'id' ],
            }, {
                model: this.db.Sport,
                as: 'sport',
                attributes: [ 'id' ],
            }, {
                model: this.db.Team,
                as: 'teams',
                include: [
                    {
                        model: this.db.Coach,
                        as: 'coach',
                    }, {
                        model: this.db.Division,
                        as: 'divisions',
                        include: [{
                            model: this.db.Gender,
                            as: 'gender',
                        }]
                    }
                ],
            }, {
                model: this.db.Facility,
                as: 'facilities',
                include: [{
                    model: this.db.State,
                    as: 'state',
                }]
            }],
        });

        expect({
            sport: {
                id: event.sport.id,
            },
            name: event.name,
            image: {
                url: event.image_url,
            },
            teams: event.teams.map(team => ({
                external_team_id: team.external_team_id,
                name: team.name,
                external_coach_id: team.coach.external_coach_id,
            })),
            divisions: event.teams.map(team => ({
                name: team.divisions[0].name,
                abbreviation: team.divisions[0].abbreviation,
                skill: team.divisions[0].skill,
                gender: {
                    id: team.divisions[0].gender.id,
                },
                teams: [{
                    external_team_id: team.external_team_id,
                }],
            })),
            coaches: event.teams.map(team => ({
                external_coach_id: team.coach.external_coach_id,
                first_name: team.coach.first_name,
                last_name: team.coach.last_name,
                email: team.coach.email,
                phone: team.coach.phone,
            })),
            facilities: event.facilities.map(facility => ({
                name: facility.name,
                abbreviation: facility.abbreviation,
                street: facility.street,
                city: facility.city,
                zip: facility.zip,
                state: {
                    name: facility.state.name,
                    abbreviation: facility.state.abbreviation,
                },
                map: {
                    url: facility.mapUrl,
                },
            })),
        }).to.deep.equal(_.omit(data, ['dates']));

        expect(new Date(event.start_date)).to.equalDate(data.dates.start);
        expect(new Date(event.end_date)).to.equalDate(data.dates.end);
    });

    it('return 201 if the event was created without facilities by an authenticated operator', async function() {

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const data = {
            sport: {
                id: sport.id,
            },
            name: 'some event name',
            dates: {
                start: new Date(),
                end: new Date(),
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
            teams: [{
                external_team_id: 90,
                name: 'some team name',
                external_coach_id: 900,
            }],
            divisions: [{
                name: 'some division name',
                abbreviation: 'XX',
                skill: 'some skill',
                gender: {
                    id: 1,
                },
                teams: [{
                    external_team_id: 90,
                }],
            }],
            coaches: [{
                external_coach_id: 900,
                first_name: 'coach first name',
                last_name: 'coach last name',
                email: 'coach@email',
                phone: '99999999',
            }],
        };

        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const eventId = res.header.location.split('/').pop();
        expect(res.header.location).to.equal(`${res.request.url}/${eventId}`);

        expect(res.body).to.deep.equal({
            id: parseInt(eventId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const event = await this.db.Event.findById(eventId, {
            include: [{
                model: this.db.Operator,
                as: 'operator',
                attributes: [ 'id' ],
            }, {
                model: this.db.Sport,
                as: 'sport',
                attributes: [ 'id' ],
            }, {
                model: this.db.Team,
                as: 'teams',
                include: [
                    {
                        model: this.db.Coach,
                        as: 'coach',
                    }, {
                        model: this.db.Division,
                        as: 'divisions',
                        include: [{
                            model: this.db.Gender,
                            as: 'gender',
                        }]
                    }
                ],
            }, {
                model: this.db.Facility,
                as: 'facilities',
                include: [{
                    model: this.db.State,
                    as: 'state',
                }]
            }],
        });

        expect({
            sport: {
                id: event.sport.id,
            },
            name: event.name,
            image: {
                url: event.image_url,
            },
            teams: event.teams.map(team => ({
                external_team_id: team.external_team_id,
                name: team.name,
                external_coach_id: team.coach.external_coach_id,
            })),
            divisions: event.teams.map(team => ({
                name: team.divisions[0].name,
                abbreviation: team.divisions[0].abbreviation,
                skill: team.divisions[0].skill,
                gender: {
                    id: team.divisions[0].gender.id,
                },
                teams: [{
                    external_team_id: team.external_team_id,
                }],
            })),
            coaches: event.teams.map(team => ({
                external_coach_id: team.coach.external_coach_id,
                first_name: team.coach.first_name,
                last_name: team.coach.last_name,
                email: team.coach.email,
                phone: team.coach.phone,
            })),
        }).to.deep.equal(_.omit(data, ['dates']));

        expect(new Date(event.start_date)).to.equalDate(data.dates.start);
        expect(new Date(event.end_date)).to.equalDate(data.dates.end);
    });

    it('return 201 if the event was created without divisions by an authenticated operator', async function() {

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const data = {
            sport: {
                id: sport.id,
            },
            name: 'some event name',
            dates: {
                start: new Date(),
                end: new Date(),
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
            teams: [{
                external_team_id: 90,
                name: 'some team name',
                external_coach_id: 900,
            }],
            coaches: [{
                external_coach_id: 900,
                first_name: 'coach first name',
                last_name: 'coach last name',
                email: 'coach@email',
                phone: '99999999',
            }],
            facilities: [{
                name: 'facility name',
                abbreviation: 'YY',
                street: 'some street',
                city: 'come city',
                zip: 'some zip',
                state: {
                    name: 'state name',
                    abbreviation: 'TT',
                },
                map: {
                    url: 'http://www.someurl.com',
                },
            }],
        };

        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const eventId = res.header.location.split('/').pop();
        expect(res.header.location).to.equal(`${res.request.url}/${eventId}`);

        expect(res.body).to.deep.equal({
            id: parseInt(eventId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const event = await this.db.Event.findById(eventId, {
            include: [{
                model: this.db.Operator,
                as: 'operator',
                attributes: [ 'id' ],
            }, {
                model: this.db.Sport,
                as: 'sport',
                attributes: [ 'id' ],
            }, {
                model: this.db.Team,
                as: 'teams',
                include: [
                    {
                        model: this.db.Coach,
                        as: 'coach',
                    }, {
                        model: this.db.Division,
                        as: 'divisions',
                        include: [{
                            model: this.db.Gender,
                            as: 'gender',
                        }]
                    }
                ],
            }, {
                model: this.db.Facility,
                as: 'facilities',
                include: [{
                    model: this.db.State,
                    as: 'state',
                }]
            }],
        });

        expect({
            sport: {
                id: event.sport.id,
            },
            name: event.name,
            image: {
                url: event.image_url,
            },
            teams: event.teams.map(team => ({
                external_team_id: team.external_team_id,
                name: team.name,
                external_coach_id: team.coach.external_coach_id,
            })),
            coaches: event.teams.map(team => ({
                external_coach_id: team.coach.external_coach_id,
                first_name: team.coach.first_name,
                last_name: team.coach.last_name,
                email: team.coach.email,
                phone: team.coach.phone,
            })),
            facilities: event.facilities.map(facility => ({
                name: facility.name,
                abbreviation: facility.abbreviation,
                street: facility.street,
                city: facility.city,
                zip: facility.zip,
                state: {
                    name: facility.state.name,
                    abbreviation: facility.state.abbreviation,
                },
                map: {
                    url: facility.mapUrl,
                },
            })),
        }).to.deep.equal(_.omit(data, ['dates']));

        expect(new Date(event.start_date)).to.equalDate(data.dates.start);
        expect(new Date(event.end_date)).to.equalDate(data.dates.end);
    });

    it('return 400 if the event request has extra fields', async function() {

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const data = {
            sport: {
                id: sport.id,
            },
            name: 'some event name',
            dates: {
                start: new Date(),
                end: new Date(),
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
            teams: [{
                external_team_id: 90,
                name: 'some team name',
                external_coach_id: 900,
            }],
            divisions: [{
                name: 'some division name',
                abbreviation: 'XX',
                skill: 'some skill',
                gender: {
                    id: 1,
                },
                teams: [{
                    external_team_id: 90,
                }],
            }],
            coaches: [{
                external_coach_id: 900,
                first_name: 'coach first name',
                last_name: 'coach last name',
                email: 'coach@email',
                phone: '99999999',
            }],
            facilities: [{
                name: 'facility name',
                abbreviation: 'YY',
                street: 'some street',
                city: 'come city',
                zip: 'some zip',
                state: {
                    name: 'state name',
                    abbreviation: 'TT',
                },
                map: {
                    url: 'http://www.someurl.com',
                },
            }],
            bad_field: 'bad field',
        };

        const count = await this.db.Event.count();

        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(400, {
            error: '"bad_field" is not allowed',
        });

        expect(res.header.location).to.not.exist;

        const newCount = await this.db.Event.count();
        expect(newCount).to.equals(count);

    });

    it('return 400 if the team has an unexistent external_coach_id', async function() {

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const data = {
            sport: {
                id: sport.id,
            },
            name: 'some event name',
            dates: {
                start: new Date(),
                end: new Date(),
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
            teams: [{
                external_team_id: 90,
                name: 'some team name',
                external_coach_id: 900,
            }],
            divisions: [{
                name: 'some division name',
                abbreviation: 'XX',
                skill: 'some skill',
                gender: {
                    id: 1,
                },
                teams: [{
                    external_team_id: 90,
                }],
            }],
            facilities: [{
                name: 'facility name',
                abbreviation: 'YY',
                street: 'some street',
                city: 'come city',
                zip: 'some zip',
                state: {
                    name: 'state name',
                    abbreviation: 'TT',
                },
                map: {
                    url: 'http://www.someurl.com',
                },
            }],
        };

        const count = await this.db.Event.count();

        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(400, {
            error: 'The coach with external_coach_id \'900\' into the team \'some team name\' does not exist.',
        });

        expect(res.header.location).to.not.exist;

        const newCount = await this.db.Event.count();
        expect(newCount).to.equals(count);

    });

    it('return 400 if division has an unexistent external_team_id', async function() {

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const data = {
            sport: {
                id: sport.id,
            },
            name: 'some event name',
            dates: {
                start: new Date(),
                end: new Date(),
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
            divisions: [{
                name: 'some division name',
                abbreviation: 'XX',
                skill: 'some skill',
                gender: {
                    id: 1,
                },
                teams: [{
                    external_team_id: 90,
                }],
            }],
            coaches: [{
                external_coach_id: 900,
                first_name: 'coach first name',
                last_name: 'coach last name',
                email: 'coach@email',
                phone: '99999999',
            }],
            facilities: [{
                name: 'facility name',
                abbreviation: 'YY',
                street: 'some street',
                city: 'come city',
                zip: 'some zip',
                state: {
                    name: 'state name',
                    abbreviation: 'TT',
                },
                map: {
                    url: 'http://www.someurl.com',
                },
            }],
        };

        const count = await this.db.Event.count();

        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(400, {
            error: `The team with external_team_id '${data.divisions[0].teams[0].external_team_id}' into the division '${data.divisions[0].name}' does not exist.`,
        });

        expect(res.header.location).to.not.exist;

        const newCount = await this.db.Event.count();
        expect(newCount).to.equals(count);

    });

    it('return 401 if operator was not authenticated', async function() {
        const count = await this.db.Event.count();
        await request(this.app).post('/api/v1/events').expect(401, {});
        const newCount = await this.db.Event.count();
        expect(newCount).to.equals(count);
    });
  
    it('return 400 if the name is empty', async function() {
        const sport = await this.db.Sport.create({
            name: 'some sport',
        });
        const res = await request(this.app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send({
            dates: {
                start: new Date(),
                end: new Date(),
            },
            sport: {
                id: sport.id,
            },
            image: {
                url: 'https://www.google.com.ar/',
            },
        })
        .expect(400, {
            error: '"name" is required'
        });
        expect(res.header.location).to.not.exist;
    });

});
