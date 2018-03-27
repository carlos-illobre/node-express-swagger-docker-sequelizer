const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/events/:id/points', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and a pointset', async function() {

        const data = {
            name: 'event name',
            start_date: new Date(),
            end_date: new Date(),
            image_url: 'https://www.google.com.ar/',
            operator_id: this.operator.id,
        };

        const sport = await this.db.Sport.create({
            name: 'some sport',
        });

        const event = await this.db.Event.create({
            ...data,
            sport_id: sport.id,
        });

        const points = await this.db.CustomPoint.findAll({
            attributes: ['id', 'points'],
            raw: true,
        });

        return request(this.app)
        .get(`/api/v1/events/${event.id}/points`)
        .expect(200, { points });

    });

});
