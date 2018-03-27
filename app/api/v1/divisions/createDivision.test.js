const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/divisions', function () {

    beforeEach(function() {
        return createTestApp(this);
    });

    it('return 201 if the division was created by an authenticated operator', async function() {

        const data = {
            name: 'division name',
            abbreviation: 'xxx',
            skill: 'xx',
        };

        const gender = await this.db.Gender.create({
            name: 'some gender',
        });

        data.gender_id = gender.id;

        const res = await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const divisionId = res.header.location.split('/').pop();

        expect(res.header.location).to.equal(`${res.request.url}/${divisionId}`);
        expect(res.body).to.deep.equal({
            id: parseInt(divisionId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const division = await this.db.Division.findById(divisionId);
        expect(division).to.include(data);
        expect(division.abbreviation).to.equal('xxx');

    });

    it('return 201 if the division was created by an authenticated operator and generates the division abbreviation', async function() {

        const data = {
            name: 'division name',
            skill: 'xx',
        };

        const gender = await this.db.Gender.create({
            name: 'some gender',
        });

        data.gender_id = gender.id;

        const res = await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const divisionId = res.header.location.split('/').pop();

        expect(res.header.location).to.equal(`${res.request.url}/${divisionId}`);
        expect(res.body).to.deep.equal({
            id: parseInt(divisionId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const division = await this.db.Division.findById(divisionId);
        expect(division).to.include(data);

        expect(division.abbreviation).to.equal('dsx');

    });

    it('return 201 if the division was created by an authenticated operator and generates the division abbreviation if th abbreviation is empty', async function() {

        const data = {
            name: 'division name',
            skill: 'xx',
            abbreviation: '',
        };

        const gender = await this.db.Gender.create({
            name: 'some gender',
        });

        data.gender_id = gender.id;

        const res = await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const divisionId = res.header.location.split('/').pop();

        expect(res.header.location).to.equal(`${res.request.url}/${divisionId}`);
        expect(res.body).to.deep.equal({
            id: parseInt(divisionId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const division = await this.db.Division.findById(divisionId);
        expect(division).to.include({
            ...data,
            abbreviation: 'dsx',
        });

    });

    it('return 201 if the division was created by an authenticated operator and generates the division abbreviation when the division has not a skill', async function() {

        const data = {
            name: 'division name',
        };

        const gender = await this.db.Gender.create({
            name: 'some gender',
        });

        data.gender_id = gender.id;

        const res = await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;

        const divisionId = res.header.location.split('/').pop();

        expect(res.header.location).to.equal(`${res.request.url}/${divisionId}`);
        expect(res.body).to.deep.equal({
            id: parseInt(divisionId),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });

        const division = await this.db.Division.findById(divisionId);
        expect(division).to.include(data);

        expect(division.abbreviation).to.equal('ds');

    });

    it('return 401 if operator was not authenticated', async function() {
        const oldCount = await  this.db.Division.count();
        await request(this.app)
        .post('/api/v1/divisions')
        .expect(401, {});
        const newCount = await this.db.Division.count();
        expect(oldCount).to.equals(newCount);
    });
  
    it('return 400 if the name is empty', async function() {
        const gender = await this.db.Gender.create({
            name: 'some gender',
        });
        const res = await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send({
            name: '',
            gender_id: gender.id,
            abbreviation: 'xxx',
            skill: 'xx',
        })
        .expect(400);

        expect(res.header.location).to.not.exist;
    });

    it('return 400 if no name', async function() {
        const gender = await this.db.Gender.create({
            name: 'some gender',
        });
        const res = await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send({
            gender_id: gender.id,
            abbreviation: 'xxx',
            skill: 'xx',
        })
        .expect(400, {
            error: 'undefined. SQLITE_CONSTRAINT: NOT NULL constraint failed: divisions.name'
        });

        expect(res.header.location).to.not.exist;
    });

    it('return 400 if the gender_id does not exist', async function() {

        const data = {
            name: 'division name',
            gender_id: 34534,
            abbreviation: 'xxx',
            skill: 'xx',
        };

        this.app.setExtraErrorFields({
            fields: ['gender_id'],
            value: data.gender_id,
        });

        await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(400, {
            error: `The gender_id ${data.gender_id} does not exists`
        });

        const count = await this.db.Division.count();
        expect(count).to.equal(0);

    });

    it('return 400 if no gender_id', async function() {

        const data = {
            name: 'division name',
            abbreviation: 'xxx',
            skill: 'xx',
        };

        await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(400, {
            error: 'undefined. SQLITE_CONSTRAINT: NOT NULL constraint failed: divisions.gender_id'
        });

        const count = await this.db.Division.count();
        expect(count).to.equal(0);

    });

    it('return 400 if the gender_id is empty', async function() {

        const data = {
            name: 'division name',
            gender_id: '',
            abbreviation: 'xxx',
            skill: 'xx',
        };

        const error = {
            name: 'SequelizeDatabaseError',
            message: `Incorrect integer value: '${data.gender_id}' for column 'gender_id' at row 1`,
        };

        this.app.setExtraErrorFields(error);

        await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(400, {
            error: error.message,
        });
        const count = await this.db.Division.count();
        expect(count).to.equal(0);

    });

    it('return 400 if the gender_id is not a number', async function() {

        const data = {
            name: 'division name',
            gender_id: 'xxx',
            abbreviation: 'xxx',
            skill: 'xx',
        };

        const error = {
            name: 'SequelizeDatabaseError',
            message: `Incorrect integer value: '${data.gender_id}' for column 'gender_id' at row 1`,
        };

        this.app.setExtraErrorFields(error);

        await request(this.app)
        .post('/api/v1/divisions')
        .set('Authorization', `Bearer ${this.jwt}`)
        .send(data)
        .expect(400, {
            error: error.message
        });
        const count = await this.db.Division.count();
        expect(count).to.equal(0);

    });

});
