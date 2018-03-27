const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PUT api/v1/divisions/:id/name', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 204 if the division was renamed by an authenticated operator', function() {

        const oldName = 'old name';
        const newName = 'new name';

        return this.db.Gender.create({
            name: 'some gender',
        })
        .then(gender => Promise.all([
            this.db.Division.create({
                name: oldName,
                gender_id: gender.id,
            }),
            this.db.Division.create({
                name: 'other name',
                gender_id: gender.id,
            }),
        ]))
        .then(([division, otherDivision]) => Promise.all([
            division,
            request(this.app)
            .put(`/api/v1/divisions/${division.id}/name`)
            .set('Authorization', `Bearer ${this.jwt}`)
            .send(`name=${newName}`)
            .expect(204, {}),
        ]))
        .then(([division, res]) => Promise.all([
            division.reload(),
            this.db.Division.count({
                where: {
                    name: newName,
                }
            }),
        ]))
        .then(([division, count]) => {
            expect(division.name).to.equal(newName);
            expect(count).to.equal(1);
        });

    });

    it('return 401 if operator was not authenticated', function() {

        const name = 'division name';

        return this.db.Gender.create({
            name: 'some gender',
        })
        .then(gender => this.db.Division.create({
            name,
            gender_id: gender.id,
        }))
        .then(division => Promise.all([
            division,
            request(this.app)
            .put(`/api/v1/divisions/${division.id}/name`)
            .send('name=new name')
            .expect(401, {}),
        ]))
        .then(([division, res]) => division.reload())
        .then(division => expect(division.name).to.equal(name));
    });
  
    it('return 404 if the division is does not exist', function() {

        const divisionId = 5679876;

        return request(this.app)
        .put(`/api/v1/divisions/${divisionId}/name`)
        .send('name=new name')
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(404, {
            error: `Division ${divisionId} not found`,
        });

    });

    it('return 400 if the name is empty', function() {

        const name = 'division name';
        const newName = '';

        return this.db.Gender.create({
            name: 'some gender',
        })
        .then(gender => this.db.Division.create({
            name,
            gender_id: gender.id,
        }))
        .then(division => Promise.all([
            division,
            request(this.app)
            .put(`/api/v1/divisions/${division.id}/name`)
            .set('Authorization', `Bearer ${this.jwt}`)
            .send(`name=${newName}`)
            .expect(400, {
                error: '"name" is not allowed to be empty',
            }),
        ]))
        .then(([division, res]) => division.reload())
        .then(division => expect(division.name).to.equal(name));

    });

    it('return 400 if no name', function() {

        const name = 'division name';

        return this.db.Gender.create({
            name: 'some gender',
        })
        .then(gender => this.db.Division.create({
            name,
            gender_id: gender.id,
        }))
        .then(division => Promise.all([
            division,
            request(this.app)
            .put(`/api/v1/divisions/${division.id}/name`)
            .set('Authorization', `Bearer ${this.jwt}`)
            .expect(400, {
                error: '"name" is required',
            }),
        ]))
        .then(([division, res]) => division.reload())
        .then(division => expect(division.name).to.equal(name));

    });

});
