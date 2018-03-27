const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/tiebreakers', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of points', function() {

        return this.db.Rule.findAll()
        .then((rules) => {

            return request(this.app)
            .get('/api/v1/tiebreakers')
            .expect(200, {
                tiebreakers: rules.map((rule) => {

                    return {
                        id: rule.id,
                        name: rule.name,
                        value: rule.value,
                        values: JSON.parse(rule.values),
                        order: rule.order,
                        teams: rule.teams,
                        sport_id: rule.sport_id
                    };

                })
            });

        });

    });
});
