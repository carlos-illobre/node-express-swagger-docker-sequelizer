const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/events', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of the events', async function() { 

        const data = [{
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date(),
            end_date: new Date(),
            operator_id: this.operator.id,
        }, {
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date(),
            end_date: new Date(),
            operator_id: this.operator.id,
        }];

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const events = await Promise.all(
            data.map(event => this.db.Event.create({
                ...event,
                sport_id: sport.id,
            }))
        );

        const genders = await this.db.Gender.findAll();
        const division = await this.db.Division.create({
            name: 'some division name',
            abbreviation: 'XX',
            skill: 'some skill',
            gender_id: genders[0].id,
        });

        const teams = await Promise.all([
            this.db.Team.create({
                name: 'some team name',
            }),
            this.db.Team.create({
                name: 'other team name',
            }),
        ]);
       
        await division.addTeams(teams); 

        await events[0].addTeams(teams);
        await events[0].addDivisions([division]);

        const res = await request(this.app)
        .get('/api/v1/events')
        .expect(200);

        res.body.events = res.body.events.map(event => {
            return {
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date),
            };
        });
            
        expect(res.body).to.deep.equal({
            events: events.map((event, index) => ({
                id: event.id,
                name: event.name,
                image_url: event.image_url,
                location: event.location,
                start_date: event.start_date,
                end_date: event.end_date,
                teams: {
                    count: index ? 0 : teams.length,
                },
                divisions: {
                    count: index ? 0 : 1,
                },
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${event.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });
    });

    it('return 200 and the list of the events filter by max_start_date', async function() { 

        const max_start_date = '2018-07-21';
        
        const data = [{
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2017-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }, {
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2019-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }];

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const events = await Promise.all(
            data.map(event => this.db.Event.create({
                ...event,
                sport_id: sport.id,
            }))
        );

        const res = await request(this.app)
        .get(`/api/v1/events?max_start_date=${max_start_date}`)
        .expect(200);
        
        res.body.events = res.body.events.map(event => {
            return {
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date),
            };
        });
        
        expect(res.body).to.deep.equal({
            events: events
            .filter(event => event.start_date < new Date(max_start_date))
            .map(event => ({
                id: event.id,
                name: event.name,
                image_url: event.image_url,
                location: event.location,
                start_date: event.start_date,
                end_date: event.end_date,
                teams: {
                    count: 0,
                },
                divisions: {
                    count: 0,
                },
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${event.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });
    });

    it('return 200 and the list of the events filter by min_start_date', async function() { 

        const min_start_date = '2018-07-21';
        
        const data = [{
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2017-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }, {
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2019-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }];

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const events = await Promise.all(
            data.map(event => this.db.Event.create({
                ...event,
                sport_id: sport.id,
            }))
        );

        const res = await request(this.app)
        .get(`/api/v1/events?min_start_date=${min_start_date}`)
        .expect(200);

        res.body.events = res.body.events 
        .map(event => {
            return {
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date),
            };
        });
        
        expect(res.body).to.deep.equal({
            events: events
            .filter(event => event.start_date > new Date(min_start_date))
            .map(event => ({
                id: event.id,
                name: event.name,
                image_url: event.image_url,
                location: event.location,
                start_date: event.start_date,
                end_date: event.end_date,
                teams: {
                    count: 0,
                },
                divisions: {
                    count: 0,
                },
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${event.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });
    });

    it('return 200 and the list of the events sorted by start_date', async function() { 

        const data = [{
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2019-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }, {
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2017-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }];

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const events = await Promise.all(
            data.map(event => this.db.Event.create({
                ...event,
                sport_id: sport.id,
            }))
        );

        const res = await request(this.app)
        .get('/api/v1/events?sort=start_date')
        .expect(200);
        
        res.body.events = res.body.events
        .map(event => {
            return {
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date),
            };
        });

        events.sort((a, b) => a.start_date > b.start_date);
            
        expect(res.body).to.deep.equal({
            events: events.map(event => ({
                id: event.id,
                name: event.name,
                image_url: event.image_url,
                location: event.location,
                start_date: event.start_date,
                end_date: event.end_date,
                teams: {
                    count: 0,
                },
                divisions: {
                    count: 0,
                },
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${event.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });
    });

    it('return 200 and the list of the events sorted by start_date desc', async function() { 

        const data = [{
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2017-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }, {
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2019-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }];

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const events = await Promise.all(data.map(event => this.db.Event.create({
            ...event,
            sport_id: sport.id,
        })));

        const res = await request(this.app)
        .get('/api/v1/events?sort=-start_date')
        .expect(200);

        res.body.events = res.body.events.map(event => {
            return {
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date),
            };
        });

        events.sort((a, b) => a.start_date < b.start_date);
            
        expect(res.body).to.deep.equal({
            events: events.map(event => ({
                id: event.id,
                name: event.name,
                image_url: event.image_url,
                location: event.location,
                start_date: event.start_date,
                end_date: event.end_date,
                teams: {
                    count: 0,
                },
                divisions: {
                    count: 0,
                },
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${event.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });
    });

    it('return 200 and the list of the events filtered by name and location', async function() { 

        const search = 'Fall';

        const data = [{
            image_url: 'https://placekitten.com/120/40',
            name: 'Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2017-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }, {
            image_url: 'https://placekitten.com/120/40',
            name: 'Fall Challenge 2017',
            location: 'Dallas, TX',
            start_date: new Date('2019-07-21T00:00:00.000Z'),
            end_date: new Date(),
            operator_id: this.operator.id,
        }];

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        await Promise.all(
            data.map(event => this.db.Event.create({
                ...event,
                sport_id: sport.id,
            }))
        );

        await request(this.app).get(`/api/v1/events?search=${search}`);

        expect(this.originalError.sql).to.include(
            '(`Event`.`name` REGEXP \'Fall\' OR `Event`.`location` REGEXP \'Fall\'))'
        );
    });

    it('return 200 and the second page of the event list', async function() { 
        
        const page = 2;

        const data = [...Array(31).keys()].map(n => {
            return {
                image_url: 'https://placekitten.com/120/40',
                name: `Fall Challenge 2017 ${n}`,
                location: 'Dallas, TX',
                start_date: new Date(),
                end_date: new Date(),
                operator_id: this.operator.id,
            };
        });

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const events = await Promise.all(
            data.map(event => this.db.Event.create({
                ...event,
                sport_id: sport.id,
            }))
        );

        const res = await request(this.app)
        .get(`/api/v1/events?page=${page}`)
        .expect(200);

        res.body.events = res.body.events.map(event => {
            return {
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date),
            };
        });
            
        expect(res.body).to.deep.equal({
            events: events
            .slice(10, 20)
            .map(event => ({
                id: event.id,
                name: event.name,
                image_url: event.image_url,
                location: event.location,
                start_date: event.start_date,
                end_date: event.end_date,
                teams: {
                    count: 0,
                },
                divisions: {
                    count: 0,
                },
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${event.id}`
                    }
                }
            })),
            page: `${page}`,
            count: 4,
        });
    });

    it('return 200 and the first page of the event list if the page is negative', async function() { 
        
        const data = [...Array(11).keys()].map(n => {
            return {
                image_url: 'https://placekitten.com/120/40',
                name: `Fall Challenge 2017 ${n}`,
                location: 'Dallas, TX',
                start_date: new Date(),
                end_date: new Date(),
                operator_id: this.operator.id,
            };
        });

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const events = await Promise.all(
            data.map(event => this.db.Event.create({
                ...event,
                sport_id: sport.id,
            }))
        );

        const res = await request(this.app)
        .get('/api/v1/events?page=-2')
        .expect(200);

        res.body.events = res.body.events.map(event => {
            return {
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date),
            };
        });
            
        expect(res.body).to.deep.equal({
            events: events
            .slice(0, 10)
            .map(event => ({
                id: event.id,
                name: event.name,
                image_url: event.image_url,
                location: event.location,
                start_date: event.start_date,
                end_date: event.end_date,
                teams: {
                    count: 0,
                },
                divisions: {
                    count: 0,
                },
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${event.id}`
                    }
                }
            })),
            page: 1,
            count: 2,
        });
    });

});
