const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/events/:id/tiebreaker', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and a ruleset', function() {

        const data = {
            name: 'event name',
            start_date: new Date(),
            end_date: new Date(),
            image_url: 'https://www.google.com.ar/',
            operator_id: this.operator.id,
        };

        return this.db.Sport.create({
            name: 'some sport',
        })
        .then(sport => this.db.Event.create({
            ...data,
            sport_id: sport.id,
        }))
        .then(event => Promise.all([
            event,
            this.db.EventRule.findAll({
                where: {
                    event_id: event.id
                }
            }),
        ]))
        .then(([event, rules]) => {

            const tiebreakers = rules.map(rule => ({
                id: rule.dataValues.rule_id,
                value: rule.dataValues.value,
                teams: rule.dataValues.teams,
                order: rule.dataValues.order
            }));

            tiebreakers.sort((a, b) => a.order - b.order);

            return request(this.app)
            .get(`/api/v1/events/${event.id}/tiebreaker`)
            .expect(200, { tiebreakers });
        });

    });

});
