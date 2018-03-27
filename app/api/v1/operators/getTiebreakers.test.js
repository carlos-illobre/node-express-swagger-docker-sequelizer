const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/operators/me/tiebreakers', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 200 and the list of points', function() {

        return this.db.OperatorRule.findAll()
        .then((rules) => {

            return request(this.app)
            .get('/api/v1/operators/me/tiebreakers')
            .set('Authorization', `Bearer ${this.jwt}`)
            .expect(200, {
                tiebreakers: rules.map((rule) => {

                    return {
                        id: rule.rule_id,
                        value: rule.value,
                        order: rule.order,
                        teams: rule.teams
                    };

                })
            });

        });

    });
});
