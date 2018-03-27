const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PUT api/v1/events/:id/points', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 204 if points were updated', function() {

        const data = {
            name: 'event name',
            start_date: new Date(),
            end_date: new Date(),
            image_url: 'https://www.google.com.ar/',
        };

        return Promise.all([
            this.db.Sport.create({
                name: 'some sport',
            })
        ])
        .then(([sport]) => {

            data.sport_id = 1;
            data.operator_id = this.operator.id;
            return Promise.all([
                sport,
                this.db.Event.create(data)
            ]);
        })
        .then(([sport, event]) => {
            return request(this.app)
            .put(`/api/v1/events/${event.id}/points`)
            .set('Authorization', `Bearer ${this.jwt}`)
            .send([{
                id: 1,
                points: 2
            }])
            .expect(204, {});
        });
    });

    it('return 404 if event not found', function() {

        const data = {
            name: 'event name',
            start_date: new Date(),
            end_date: new Date(),
            image_url: 'https://www.google.com.ar/',
        };

        return Promise.all([
            this.db.Sport.create({
                name: 'some sport',
            })
        ])
        .then(([sport]) => {

            data.sport_id = 1;
            data.operator_id = this.operator.id;
            return Promise.all([
                sport,
                this.db.Event.create(data)
            ]);
        })
        .then(([sport, event]) => {
            return request(this.app)
            .put('/api/v1/events/99/points')
            .set('Authorization', `Bearer ${this.jwt}`)
            .send([{
                id: 1,
                points: 2
            }])
            .expect(404);
        });
    });

    it('Do not update pointset if point does not exists', function() {

        const data = {
            name: 'event name',
            start_date: new Date(),
            end_date: new Date(),
            image_url: 'https://www.google.com.ar/',
        };

        return Promise.all([
            this.db.Sport.create({
                name: 'some sport',
            })
        ])
        .then(([sport]) => {

            data.sport_id = 1;
            data.operator_id = this.operator.id;
            return Promise.all([
                sport,
                this.db.Event.create(data)
            ]);
        })
        .then(([sport, event]) => {
            return request(this.app)
            .put(`/api/v1/events/${event.id}/points`)
            .set('Authorization', `Bearer ${this.jwt}`)
            .send([{
                id: 99,
                points: 2
            }])
            .expect(204);
        });
    });
});
