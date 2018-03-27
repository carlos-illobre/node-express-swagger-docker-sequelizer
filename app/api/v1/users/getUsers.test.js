const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const Op = require('sequelize').Op;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/users', function () {

    beforeEach(function() {
        return createTestApp(this);
    });
    
    it('return 200 and the user list', async function() { 
        
        const newUsers = await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        await newUsers[0].addAdminRole();

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get('/api/v1/users').expect(200);

        expect(res.body).to.deep.equal({
            users: users.map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by first_name', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get('/api/v1/users?sort=first_name').expect(200);

        expect(res.body).to.deep.equal({
            users: users.sort(
                (a, b) => a.first_name > b.first_name
            )
            .map(user => {
                return {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    roles: !user.roles.length ? [] : [{
                        name: this.db.Role.adminRoleName,
                    }],
                    _links: {
                        self: {
                            href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                        }
                    }
                };
            }),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by first_name desc', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
            order: [
                ['first_name', 'desc'],
            ],
        });

        const res = await request(this.app).get('/api/v1/users?sort=-first_name').expect(200);

        expect(res.body).to.deep.equal({
            users: users.map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by last_name', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get('/api/v1/users?sort=last_name').expect(200);

        expect(res.body).to.deep.equal({
            users: users.sort(
                (a, b) => a.last_name > b.last_name
            )
            .map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by last_name desc', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
            order: [
                ['last_name', 'desc'],
            ],
        });

        const res = await request(this.app).get('/api/v1/users?sort=-last_name').expect(200);

        expect(res.body).to.deep.equal({
            users: users.map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by email', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get('/api/v1/users?sort=email').expect(200);

        expect(res.body).to.deep.equal({
            users: users.sort(
                (a, b) => a.email > b.email
            )
            .map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by email desc', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get('/api/v1/users?sort=-email').expect(200);

        expect(res.body).to.deep.equal({
            users: users.sort(
                (a, b) => a.email < b.email
            )
            .map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by phone', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get('/api/v1/users?sort=phone').expect(200);

        expect(res.body).to.deep.equal({
            users: users.sort(
                (a, b) => a.phone > b.phone
            )
            .map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the user list ordered by phone desc', async function() { 

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get('/api/v1/users?sort=-phone').expect(200);

        expect(res.body).to.deep.equal({
            users: users.sort(
                (a, b) => a.phone < b.phone
            )
            .map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 400 if the sort field is xxx', function() { 
        return request(this.app)
        .get('/api/v1/users?sort=xxx')
        .expect(400, {
            error: 'SQLITE_ERROR: no such column: User.xxx',
        });
    });

    it('return 200 if the limit is not a number', function() { 
        return request(this.app)
        .get('/api/v1/users?limit=xxx')
        .expect(200);
    });

    it('return 200 and the user list filtered by phone', async function() { 

        const search = '5';

        await Promise.all(
            [{
                first_name: 'some first name',
                last_name: 'some last name',
                email: 'some@email',
                phone: '555555555',
            }, {
                first_name: 'other first name',
                last_name: 'other last name',
                email: 'other@email',
                phone: '6666666666',
            }]
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            where: {
                phone: {
                    [Op.like]: `%${search}%`,
                },
            },
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app).get(`/api/v1/users?search=${search}`).expect(200);

        expect(res.body).to.deep.equal({
            users: users.filter(user => user.phone.includes(search)).map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: 1,
            count: 1,
        });

    });

    it('return 200 and the second page of the event list', async function() { 
        
        const page = 2;
        const limit = 6;

        await Promise.all(
            [...Array(31).keys()]
            .map(n => ({
                first_name: `some first name ${n}`,
                last_name: `some last name ${n}`,
                email: 'some@email',
                phone: '555555555',
            }))
            .map(user => this.db.User.create(user))
        );

        const users = await this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'roles',
                attributes: [ 'name' ],
            }],
        });

        const res = await request(this.app)
        .get(`/api/v1/users?page=${page}&limit=${limit}`)
        .expect(200);

        expect(res.body).to.deep.equal({
            users: users.slice(limit, limit + limit).map(user => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                roles: !user.roles.length ? [] : [{
                    name: this.db.Role.adminRoleName,
                }],
                _links: {
                    self: {
                        href: `${res.request.url.replace(/\?.*$/, '')}/${user.id}`
                    }
                }
            })),
            page: '' + page,
            count: Math.ceil(users.length / limit),
        });

    });


});
