const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('PUT api/v1/divisions/:id/abbreviation', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 204 if the division abbreviation was updated by an authenticated operator', async function() {
        const abbr = 'NABBR';

        const division = await this.db.Division.create({
            name: 'Test Division',
            abbreviation: 'TD',
            skill: 'Developmental',
            gender: {
                name: 'Female'
            }
        }, {
            include: [
                {
                    model: this.db.Gender,
                    as: 'gender'
                }
            ]
        });

        await request(this.app)
        .put(`/api/v1/divisions/${division.id}/abbreviation`)
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(`abbreviation=${abbr}`)
        .expect(204);

        const dcheck = await this.db.Division.findById(division.id);
        expect(dcheck.abbreviation).to.equal(abbr);
    });

    it('return 401 if operator was not authenticated', async function() {
        const abbr = 'NABBR';

        const division = await this.db.Division.create({
            name: 'Test Division',
            abbreviation: 'TD',
            skill: 'Developmental',
            gender: {
                name: 'Female'
            }
        }, {
            include: [
                {
                    model: this.db.Gender,
                    as: 'gender'
                }
            ]
        });

        await request(this.app)
        .put(`/api/v1/divisions/${division.id}/abbreviation`)
        .send(`abbreviation=${abbr}`)
        .expect(401);

        const dcheck = await this.db.Division.findById(division.id);
        expect(dcheck.abbreviation).to.equal('TD');
    });

    it('return 404 if the division is does not exist', function() {

        const divisionId = 5679876;

        return request(this.app)
        .put(`/api/v1/divisions/${divisionId}/abbreviation`)
        .send('abbreviation=new name')
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(404, {
            error: `Division ${divisionId} not found`,
        });

    });

    it('return 400 if the abbreviation is empty', async function() {
        const abbr = '';

        const division = await this.db.Division.create({
            name: 'Test Division',
            abbreviation: 'TD',
            skill: 'Developmental',
            gender: {
                name: 'Female'
            }
        }, {
            include: [
                {
                    model: this.db.Gender,
                    as: 'gender'
                }
            ]
        });

        await request(this.app)
        .put(`/api/v1/divisions/${division.id}/abbreviation`)
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(`abbreviation=${abbr}`)
        .expect(400);

        const dcheck = await this.db.Division.findById(division.id);
        expect(dcheck.abbreviation).to.equal('TD');
    });

    it('return 400 if no abbreviation', async function() {

        const division = await this.db.Division.create({
            name: 'Test Division',
            abbreviation: 'TD',
            skill: 'Developmental',
            gender: {
                name: 'Female'
            }
        }, {
            include: [
                {
                    model: this.db.Gender,
                    as: 'gender'
                }
            ]
        });

        await request(this.app)
        .put(`/api/v1/divisions/${division.id}/abbreviation`)
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(400);

        const dcheck = await this.db.Division.findById(division.id);
        expect(dcheck.abbreviation).to.equal('TD');
    });
});
