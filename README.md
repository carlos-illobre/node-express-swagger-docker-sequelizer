# Install

1. Install [docker](https://www.docker.com/community-edition#/download)
2. Install [docker-compose](https://docs.docker.com/compose/install/)
3. Install [nodeJs](https://nodejs.org/en/download/)
4. Clone the project: `git clone git@gitlab.com:bluestarsports/tournamentsplus/scheduler-api.git`
5. Run: `npm run dev:build`
6. Open a browser and go to: `http://localhost:8080/api/doc`

# Commands

### npm test
Runs all the unit test using the test memory database

### npm run test:debug
Runs all the unit test in debug mode using the test memory database

### npm run test:nolint
Runs all the unit test using the test memory database without the linter check

### npm run test:migrate
Runs all the migrations into the in memory database

### npm run dev:build
Build or rebuild all the docker containers and executes the node container in development mode.
It executes a [nodemon](https://github.com/remy/nodemon) instance to detect any change in the source code without the need of restart the container.

### npm run dev
Executes the node docker container in development mode without build it.
It executes a [nodemon](https://github.com/remy/nodemon) instance to detect any change in the source code without the need of restart the container.

### npm run dev:debug
Executes the node docker container in debug mode.

### npm run dev:shell
Opens a shell to the node container.

### npm run dev:migrate
Executes the database migrations on the dev docker container database

### npm run dev:migrate:undo
Undo the last migration on the dev docker container database

### npm run dev:migrate:undo:all
Undo all the migrations on the dev docker container database

### npm run db:start
Executes the mysql server docker container.

### npm run db:cli
Open a command line interface to the mysql database. You should execute this command after `npm run db:start` or `npm run dev`

# How to create a new endpoint

To create a new endpoint you just need to create a new file into `scheduler-api/app/api` or in any subfolder.
If the file exports an express Router then the Router will be automatically injected into the express application:

```
// scheduler-api/app/api/v1/my/url/helloworld.js
const express = require('express')

module.exports = express
  .Router({mergeParams: true})
  .get('/my/url', (req, res, next) => {
    res.send('Hello')
  })  

```

Now just save it and if the server was started with `npm run dev` or `npm run dev:build` then the endpoint will be there: http://localhost:8080/api/my/url
(The urls of all the automatic injected Routers will always start with `/api`).
The folder structure should be like the url path, so if the endpoint is `GET /my/url/helloword` then the file should be in `scheduler-api/app/api/my/url/helloworld.js`,


# How to create a sequelizer entity (and a Migration)

Go to the `models` folder and create file like this to define the sequelize entity:
```
// scheduler-api/models/Sport.js
module.exports = (sequelize, DataTypes) => {

    const Sport = sequelize.define('Sport', {
        name: DataTypes.STRING,
    }, {
        tableName: 'sports',
    });
    
    return Sport;
    
};
```
Now go to the `migrations` folder and create a file like this:
```
// scheduler-api/migrations/20171101181703-create-sport.js
module.exports = {
    
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('sports', {
            id: {
                allowNull: false,
                autoIncrement: true,    
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(100),
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,   
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted: {
                type: Sequelize.DATE,
            },
        })
    },

    down(queryInterface, Sequelize) {
        return queryInterface.dropTable('sports')
    }

};
```
The filename must start with a timestamp to be recognized and executed. All the new migrations will be automatically executed every time the node server is up.

# How to execute Queries from the endpoint

Every endpoint will have all the sequelize models injected into the `req.db` parameter, so we can do this:

```
// scheduler-api/app/api/v1/sports/getSports.js
const express = require('express');
    
module.exports = express       
.Router({mergeParams: true})   
.get('/v1/sports', async (req, res, next) => {
  
    const sports = await req.db.Sport.findAll({
        raw: true,
    });
    res.send({ sports });

});  
```
You should never return the entity, you can use `raw: true` to return the raw data.

# Logger

Every endpoint will have a logger injected into the `req.logger` parameter:

```
// scheduler-api/app/api/v1/sports/getSports.js
const express = require('express');
    
module.exports = express       
.Router({mergeParams: true})   
.get('/v1/sports', async (req, res, next) => {

    req.logger.info('hello');
    const sports = await req.db.Sport.findAll({
        raw: true
    });
    res.send({ sports });

});  
```

The logger is an instance of [Winston](https://github.com/winstonjs/winston) so you can use `info`, `error`, `warn` and all the winston supported methods.

# How to create a test

To create a test you just need to create a new file into `scheduler-api/app` or into `scheduler-api/models` or into any sub folder. The filename extension must be `.test.js`:

```
const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/sports', function () {
  
    beforeEach(function() {    
        return createTestApp(this);     
    }); 
      
    it('return 200 and the list of sports', async function() {
      
        const sports = await this.db.Sport.findAll();
        
        request(this.app)
        .get('/api/v1/sports')          
        .expect(200, {
            sports: sports.map((sport) => {
                return {   
                    id: sport.id,                   
                    name: sport.name,               
                };

            })
        });

    });

})
```
then just run `npm test`.

The test file should be in the same folder as the file to be tested.
This method creates and destroy the in memory database in each test.
The `createTestApp` creates the in memory database, executes all the migrations and set the following properties into the `this` object:
* db: It is the same object than `req.db`. It has all the entities and is the database reefrence
* app: It is the express application
* operator: An operator user to authenticate operator's endpoints
* jwt: The operator user jwt
* admin: An admin user to authenticate admin's endpoints
* adminJwt: The admin user jwt

You can't use an arrow function like this `it('return 200 and the list of sports', async () => {` because each test shares the `this` reference.

If you want to see the executed queries and the log info just add a `true` parameter to the `createTestApp` function:

```
const request = require('supertest');

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('GET api/v1/sports', function () {
  
    beforeEach(function() {    
        return createTestApp(this, true);     
    }); 
      
    it('return 200 and the list of sports', async function() {
      
        const sports = await this.db.Sport.findAll();
        
        request(this.app)
        .get('/api/v1/sports')          
        .expect(200, {
            sports: sports.map((sport) => {
                return {   
                    id: sport.id,                   
                    name: sport.name,               
                };

            })
        });

    });

})
```

# How to create the Swagger documentation:

Just create a file into the endpoint's folder with the extension `.swagger.yaml` like this:
```
/v1/sports:
    get:
        tags:                  
            - sports           
        summary: Get all the sports     
        description: Get all the sports. This is a public endpoint.
        operationId: getSports.js       
        produces:
            - application/json 
        responses:             
            200:
                description: OK
                schema:        
                    type: object                    
                    required:  
                        - sports                        
                    properties:
                        sports:
                            type: array                     
                            items:                          
                                type: object                    
                                required:                       
                                    - id                            
                                    - name                          
                                properties:                     
                                    id:                             
                                        type: number                    
                                        example: 1                      
                                    name:                           
                                        type: string                    
                                        example: Soccer                 
            500:               
                description: Internal server error
```
You should put an example value to each property.
The file must use the Swagger 2.0 format.

# Authentication

To authenticate an endpoint you have to add the `authJwtMiddleware`, this middleware uses the jwt and search the user into the database. If the user does not exists then return a 401 error, if the user exists then the user instance will be in `req.user`:

```
const express = require('express');
const authJwt = require(`${process.env.PWD}/app/authJwtMiddleware.js`);
const halson = require('halson');

module.exports = express       
.Router({mergeParams: true})   
.post('/v1/divisions', authJwt, async (req, res, next) => {

    try {

        req.logger.info(`The user id is: ${req.user.id}`);
    
        const devision = await req.db.Division.create({
            name: req.body.name,   
            gender_id: req.body.gender_id,  
            abbreviation: req.body.abbreviation,
            skill: req.body.skill,
        });
        
        const location = `${req.base}${req.originalUrl}/${division.id}`;
        res.setHeader('Location', location);
        res.status(201).json(  
            halson({
                id: division.id
            }).addLink('self', location)    
        );
        
    } catch(error) {
        next(error);
    }
          
});
```

* Every POST endpoint must responds a location header with the created resource, in this example will be `http://localhost:8080/divisions/1`.
* In case of error you have to use try/catch and send the error to `next(error)`
* You should never return the full instance, you should return a [HAL](http://stateless.co/hal_specification.html) object:

```
res.status(201).json(  
    halson({
        id: division.id
    }).addLink('self', location)    
);
```

That code will produce this:

```
{
  "_links": {
    "self": {
      "href": "http://localhost:8080/divisions/1"
    }
  }
}
```

You can add more links if you need it.

## Admin authentication

If the endpoint needs an admin authentication then you have to add a second middleware: `authAdminJwtMiddleware`

```
const express = require('express');
const authJwt = require(`${process.env.PWD}/app/authJwtMiddleware.js`);
const authAdminJwt = require(`${process.env.PWD}/app/authAdminJwtMiddleware.js`);
const halson = require('halson');

module.exports = express       
.Router({mergeParams: true})   
.post('/v1/users', authJwt, authAdminJwt, async (req, res, next) => {
      
    const user = await req.db.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,  
        email: req.body.email,
        phone: req.body.phone, 
    });   
          
    const location = `${req.base}/api/v1/users/${user.id}`;
          
    res.setHeader('Location', location);
    res.status(201).json(
        halson({
            id: user.id
        })
        .addLink('self', location)      
    );    
          
});  
```
The `authAdminJwtMiddleware` search in the database if the logged user is admin. If the user is not admin it returns a 401 error, if the user is admin the the endpoint is executed.

## How to test the authentication
Every test will have a `this.jwt` for operators and a `this.adminJwt` for admins, so to test the endpoint you have to add this header `.set('Authorization', `Bearer ${this.adminJwt}`)`

```
// scheduler-api/app/api/v1/users/createUser.test.js 
const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-string'));
const expect = chai.expect;

const createTestApp = require(`${process.env.PWD}/test/createTestApp.js`);

describe('POST api/v1/users', function () {

    beforeEach(async function() {
        await createTestApp(this);
    });

    it('return 201 if the user was created by an authenticated admin user', async function() {

        const data = {
            first_name: 'Gigi',
            last_name: 'Lemon',
            email: 'some@email',
            phone: '23434545',
        };

        const res = await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.adminJwt}`)
        .send(data)
        .expect(201);

        expect(res.header.location).to.exist;
        const id = res.header.location.split('/').pop();
        expect(res.header.location).to.equal(`${res.request.url}/${id}`);
        expect(res.body).to.deep.equal({
            id: parseInt(id),
            _links: {
                self: {
                    href: res.header.location,
                },
            },
        });
        const user = await this.db.User.findById(id);

        expect(user).to.include({
            ...data,
        });

    });

    it('return 401 if the user was not authenticated', async function() {

        const originalCount = await this.db.User.count();

        await request(this.app)
        .post('/api/v1/users')
        .expect(401, {});

        const newCount = await this.db.User.count();

        expect(originalCount).to.equals(newCount);

    });

    it('return 401 if the user is not admin', async function() {

        const originalCount = await this.db.User.count();

        await request(this.app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.jwt}`)
        .expect(401, {
            error: 'This is an Administrator only resource.',
        });

        const newCount = await this.db.User.count();

        expect(originalCount).to.equals(newCount);

    });

})
```

## Test with Swagger
To make the endpoint testable from swagger you have to add the header parameter:
```
 /v1/users:
    post:
        tags:                  
            - users            
        summary: Creates a user
        description: Creates a user
        operationId: createUser.js      
        consumes:
            - application/json 
            - application/x-www-form-urlencoded
        produces:
            - application/json 
        parameters:            
        -   name: Authorization
            in: header         
            description: Authorization token
            required: true     
            type: string       
            example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjF9LCJpYXQiOjE1MTAxNTI2MDEsImV4cCI6MTUxMDIzOTAwMX0.5JmvBOkG3jkhQfZwB61o650P0XDqIijuRv41m6Sn6Qk
        -   name: body
            in: body
            required: true
            schema:
                type: object   
                properties:
                    first_name:
                        type: string                    
                        example: Greg                   
                    last_name: 
                        type: string                    
                        example: Williams  
                    email:     
                        type: string                    
                        example: gwilliams@bluestarspots.com
                        format: email                   
                    phone:     
                        type: string   
                        example: 555-5555
        responses:
           201:
                description: Created
                headers:
                    Location:
                        description: http://localhost:8080/api/v1/users/1
                        type: string
                        format: uri
                schema:
                    type: object
                    required:
                        - _links
                    properties:
                        _links:
                            type: object
                            required:
                                - id
                                - self
                            properties:
                                id:
                                    type: number
                                    example: 1
                                self:
                                    type: object
                                    required:
                                        - href
                                    properties:
                                        href:
                                            type: string
                                            format: uri
                                            example: http://localhost:8080/users/1
            400:
                description: Bad Request
            500:
                description: Internal server error
```

# Migrations with Foreign Keys:
You have to add the `model` with the name of the TABLE (not the model name)
[more](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html#instance-method-createTable)
```
module.exports = {
      
    up(queryInterface, Sequelize) {
        queryInterface.createTable('divisions', {
            id: {
                allowNull: false,  
                autoIncrement: true,            
                primaryKey: true,  
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,  
                type: Sequelize.STRING(100),    
            },
            gender_id: {           
                allowNull: false,  
                type: Sequelize.INTEGER,        
                references: {
                    model: 'genders',        
                    key: 'id'
                },
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,           
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,           
            },
            deleted: {
                type: Sequelize.DATE,
            },
        })
    },
    
    down(queryInterface, Sequelize) {
        return queryInterface.dropTable('divisions');
    }
    
};
```

# How to create a migration with more than one sentence:
```
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('facilities', 'state');
        await queryInterface.addColumn('facilities', 'state_id', {
            type: Sequelize.INTEGER,        
            references: {
                model: 'states',                
                key: 'id',
            },
        });
        await queryInterface.changeColumn('facilities', 'deleted', {
            type: Sequelize.DATE,           
            allowNull: true,
        });
        await queryInterface.changeColumn('events_facilities', 'deleted', {
            type: Sequelize.DATE,           
            allowNull: true,
        });
        await queryInterface.addColumn('coaches', 'external_coach_id', {
            type: Sequelize.INTEGER,        
        });
        await queryInterface.changeColumn('divisions_teams', 'division_id', {
            type: Sequelize.INTEGER,        
            allowNull: false,
        });
        await queryInterface.changeColumn('divisions_teams', 'team_id', {
            type: Sequelize.INTEGER,        
            allowNull: false,
        });                    
    },

   down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('divisions_teams', 'team_id', {
            type: Sequelize.INTEGER,        
            allowNull: true,   
        });
        await queryInterface.changeColumn('divisions_teams', 'division_id', {
            type: Sequelize.INTEGER,        
            allowNull: true,
        });
        await queryInterface.removeColumn('coaches', 'external_coach_id');
        await queryInterface.changeColumn('events_facilities', 'deleted', {
            type: Sequelize.DATE,
            allowNull: false,
        });
        await queryInterface.changeColumn('facilities', 'deleted', {
            type: Sequelize.DATE,
            allowNull: false,
        });
        await queryInterface.removeColumn('facilities', 'state_id');
        await queryInterface.addColumn('facilities', 'state', {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'states',
                key: 'id',
            },
        });
    }
};
```
The `down` method must have the inverse execution order than the `up` method.

# How to create a migration to insert data:
```
module.exports = {
    
    up(queryInterface, Sequelize) {
    
        const today = new Date().toISOString().slice(0, 10);
    
        return queryInterface.sequelize.query(`
            insert into genders (name, created, modified) values
            ('Girls', '${today}', '${today}'),
            ('Boys', '${today}', '${today}'),
            ('All', '${today}', '${today}');
        `);
    },
    
    down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            delete from genders where name in (
                'Girls',
                'Boys',
                'All'
            );
        `);
    }
    
};
```

## How to create a migration to insert data and get the generated ids
```
  1 module.exports = {
  2     up(queryInterface, Sequelize) {
  3         
  4         const Sport = queryInterface.sequelize.import('../models/Sport.js')
  5         
  6         return Sport.bulkCreate([{
  7             name: 'Basketball',
  8         }, {
  9             name: 'Soccer',
 10         }])
 11     },
 12     
 13     down(queryInterface, Sequelize) {
 14         queryInterface.bulkDelete('sports', {
 15             name: [
 16                 'Basketball',
 17                 'Soccer',
 18             ],
 19         })
 20     }
 21 };
```

# One to many associations:

To associate two entities you have to add an `associate` method to the model:

```
// scheduler-api/models/Gender.js 
module.exports = (sequelize, DataTypes) => {
    
    const Gender = sequelize.define('Gender', {
        name: DataTypes.STRING,
    }, {
        tableName: 'genders',  
    });
    
    return Gender;
    
}; 
```
```
module.exports = (sequelize, DataTypes) => {
      
    const Division = sequelize.define('Division', {
        name: {
            type: DataTypes.STRING,         
            validate: {        
                notEmpty: {
                    msg: 'The division name can not be empty',
                },
            },
        },
        abbreviation: {        
            type: DataTypes.STRING,         
        },                     
        skill: {               
            type: DataTypes.STRING,         
        },
    }, {
        tableName: 'divisions',
    });

    Division.associate = (models) => {
        Division.Gender = Division.belongsTo(models.Gender, { as: 'gender' });
    };
    
    return Division;

};
```
You have to store the `belongsTo` return value into the model object and always add a lowercase alias: `Division.Gender = Division.belongsTo(models.Gender, { as: 'gender' });`

# Many to many associations

You need to create an intermediate entity, for example to asociate many events to many custom points we need a `EventCustoPoint` relation table:

```
// scheduler-api/models/EventCustomPoint.js
module.exports = (sequelize, DataTypes) => {
    const EventCustomPoint = sequelize.define('EventCustomPoint', {
        custom_point_id: DataTypes.INTEGER,
        event_id: DataTypes.INTEGER,    
        points: DataTypes.INTEGER       
    }, {
        tableName: 'events_custom_points'
    });                        
    return EventCustomPoint;   
};
```
And now we can do the association:
```
// scheduler-api/models/Event.js
module.exports = (sequelize, DataTypes) => {
      
    const Event = sequelize.define('Event', {
        name: {
            type: DataTypes.STRING,         
            validate: {        
                notEmpty: {    
                    msg: 'The event name can not be empty',
                },             
            },                 
        },                     
        start_date: {          
            type: DataTypes.DATE,           
        },
        end_date: {            
            type: DataTypes.DATE,           
        },
        image_url: {           
            type: DataTypes.STRING,         
        },
        location: {            
            type: DataTypes.STRING,         
        }
    }, {
        tableName: 'events',   
    });
    
    Event.associate = (models) => { 
        Event.Operator = Event.belongsTo(models.Operator, { as: 'operator' });
        Event.Sport = Event.belongsTo(models.Sport, { as: 'sport' });
        Event.CustomPoints = Event.belongsToMany(models.CustomPoint, {
            through: models.EventCustomPoint,
            foreignKey: 'event_id',         
            as: 'customPoints',
        });    
    };

    Event.afterCreate(async (event, options) => {
        const customPoints = await sequelize.models.CustomPoint.findAll();
        return await event.addCustomPoints(customPoints, { transaction: options.transaction });
    });

    return Event;
};
```

The association will create the `addCustomPoints` method so you can use it in any place, for example in a hook:

```
Event.afterCreate(async (event, options) => {
    const customPoints = await sequelize.models.CustomPoint.findAll();
    return await event.addCustomPoints(customPoints, { transaction: options.transaction });
});
```

# Intance methods

When you want to avoid duplicate code between enpoints you can put it into an entity instance method like this:
```
module.exports = (sequelize, DataTypes) => {
                               
    const User = sequelize.define('User', {
        first_name: DataTypes.STRING,   
        last_name: DataTypes.STRING,    
        email: DataTypes.STRING,        
        phone: DataTypes.STRING,        
    }, {
        tableName: 'users',    
    });

    User.associate = (models) => {  
        User.Roles = User.belongsToMany(models.Role, {
            through: models.UserRole,       
            foreignKey: 'user_id',          
            as: 'roles',       
        });
        User.Role = User.Roles.target;  
    };
    
    User.prototype.addAdminRole = async function() {
        const adminRole = await User.Role.getAdminRole(); 
        await this.addRole(adminRole);  
        return this;           
    };
    
    User.prototype.isAdmin = async function() {
        await this.reload({    
            include: [{        
                model: User.Role,               
                as: 'roles',   
                attributes: [ 'name' ],         
            }],                
        });
        return this.roles.find(role => role.name == User.Role.adminRoleName);
    };
    
    return User;
    
};
```
Now you can use that method from everywhere:
```
const user = await this.db.User.create(data);
await user.addAdminRole();
```

# Transactions

```
const express = require('express');
const halson = require('halson');

module.exports = express       
.Router({mergeParams: true})   
.post('/v1/events', async (req, res, next) => {
      
    const transaction = await req.db.sequelize.transaction();

    try {
    
        const facilities = await Promise.all(
            req.body.facilities.map(facility => req.db.Facility.create({
                name: facility.name,
                abbreviation: facility.abbreviation,
                street: facility.street,
                city: facility.city,
                zip: facility.zip,
                mapUrl: facility.map.url,
                state_id: statesMap.get(facility.state.abbreviation).id,
            }, { transaction }))
        );

        const event = await req.db.Event.create({
            sport_id: req.body.sport.id,
            name: req.body.name,
            start_date: req.body.dates.start,
            end_date: req.body.dates.end,
            image_url: req.body.image.url,
            operator_id: req.user.id,
        }, { transaction });

        await event.addFacilities(facilities.map(facility => facility.id), { transaction });

        const location = `${req.base}/api/v1/events/${event.id}`;
        res.setHeader('Location', location);
        res.status(201).json(
            halson({
                id: event.id
            })
            .addLink('self', location)
        );

        transaction.commit();

    } catch(error) {
        transaction.rollback();
        next(error);
    }

});
```

# Error handling

To handle the errors inside the endpoint just create an `Error` instance with the message an add to it a `status` property with the status code:

```
const halson = require('halson');

module.exports = express       
.Router({mergeParams: true})   
.post('/v1/events', async (req, res, next) => {
    try {
        const error = new Error(`The coach with external_coach_id '${team.external_coach_id}' into the team '${team.name}' does not exist.`);
        error.status = 400;
        throw error;
    } catch(error) {
        next(error);
    }
})
```

If the error does not have a `status` then it will be a 500 error.

# Data validation

To validate data in the entity we use the [sequelize validation framework](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations):

```
// scheduler-api/models/Division.js
module.exports = (sequelize, DataTypes) => {
                               
    const Division = sequelize.define('Division', {
        name: {
            type: DataTypes.STRING, 
            validate: {        
                notEmpty: {    
                    msg: 'The division name can not be empty',
                },             
            },                 
        },                     
        abbreviation: {        
            type: DataTypes.STRING, 
        },
        skill: {
            type: DataTypes.STRING,         
        },
    }, {
        tableName: 'divisions',
    });
    
    Division.associate = (models) => {
        Division.Gender = Division.belongsTo(models.Gender, { as: 'gender' });
        Division.Teams = Division.belongsToMany(models.Team, {
            through: models.DivisionTeam,
            as: 'teams'
        });
    };
    
    return Division;           
    
};  
```

The endpoint response will be:
```
{
    error: "The division name can not be empty"
}
```

When you want to validate the endpoint request we use [Express Validation](https://github.com/AndrewKeig/express-validation) as middleware:

```
// scheduler-api/app/api/v1/events/createEvent.js
const express = require('express');
const validate = require('express-validation');
const requestSchema = require('./createEventRequestSchema.js');

module.exports = express       
.Router({mergeParams: true})   
.post('/v1/events', validate(requestSchema), async (req, res, next) => {
      
```
The schema uses [Joi](https://github.com/hapijs/joi) as framework:
```
// scheduler-api/app/api/v1/events/createEventRequestSchema.js
const Joi = require('joi');    
                               
module.exports = {             
    options: {
        allowUnknownBody: false,        
    },
    body: {
        sport: Joi.object().keys({
            id: Joi.number().integer().min(1).required(),
        }).required(),
        name: Joi.string().max(200).required(),
        dates: Joi.object().keys({      
            start: Joi.date().iso().required(),
            end: Joi.date().iso().required(),
        }).required(),
        image: Joi.object().keys({      
            url: Joi.string().uri().required(),
        }).required(),
        teams: Joi.array().items(       
            Joi.object().keys({
                external_team_id: Joi.number().integer().min(1),
                name: Joi.string().max(200).required(),
                external_coach_id: Joi.number().integer().min(1),
            })
        ),
        divisions: Joi.array().items(   
            Joi.object().keys({
                name: Joi.string().max(200).required(),
                abbreviation: Joi.string().required(),
                skill: Joi.string().required(),
                gender: Joi.object().keys({
                    id: Joi.number().min(1).required(), 
                }).required(), 
                teams: Joi.array().items(       
                    Joi.object().keys({
                        external_team_id: Joi.number().min(1).required(), 
                    })
                ).required(),  
            })
        ),
        coaches: Joi.array().items(
            Joi.object().keys({
                external_coach_id: Joi.number().min(1),
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                email: Joi.string().email().required(),
                phone: Joi.string(),
            })
        ),
        facilities: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                abbreviation: Joi.string().required(),
                street: Joi.string().required(),
                city: Joi.string().required(),
                zip: Joi.string().required(),
                state: Joi.object().keys({
                    name: Joi.string().required(),
                    abbreviation: Joi.string().required(),
                }).required(),
                map: Joi.object().keys({
                    url: Joi.string().uri(),
                })
            })
        ),
    }
};
```