// process.env.NODE_ENV = 'test';

//inside tests/test_helper.jsconst 
mongoose = require('mongoose');
const chai = require('chai');
const assert = require('assert');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

const User = require('../models/user');
const Package = require('../models/package');

//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;

const options = {
    useNewUrlParser: true, // use new parser (underlying mongoDB driver has depriciated)
    useUnifiedTopology: true,
    useCreateIndex: true, // use createindex() instead of ensureindex() 
    useFindAndModify: false,
    autoIndex: true, // build indexes
}

mongoose.connect('mongodb://localhost:27017/test', options); 

mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
        console.warn('Error : ',error);
    });//Called hooks which runs before something.
beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
         //this function runs after the drop is completed
        done(); //go ahead everything is done now.
    }); 
});


describe('Creating documents', () => {
    it('creates a user', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        const user = new User({ 
            name: {
                first: 'John',
                last: 'Hamm',
            },
            email: 'john@hamm.com',
            password: 'password',
            phone: {
                number: 9876543210,
            }
        });
        user.save() //takes some time and returns a promise
            .then(() => {
                assert(!user.isNew); //if poke is saved to db it is not new
                done();
            });
    });

    it('creates a package', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        const pkg = new Package({ 
            size : {
                length : 12,
                width : 12,
                height : 12
            },
            from : {
                country : "United States",
                name : "J",
                email : "john@test.com",
                phone : "6549999555",
                street : "123 Main St.",
                street2 : "Apt. #3",
                city : "Dallas",
                state : "TX",
                zip : 76207
            },
            to : {
                country : "United States",
                name : "Reciptiant",
                email : "sam@test.com",
                phone : "1234567890",
                street : "123 Main St.",
                street2 : "Apt. #1",
                city : "Denton",
                state : "Texas",
                zip : 75032
            },
            confirm : false,
            locations : [ 
                {
                    kind : "plane",
                    timestamp : Date("2019-11-27T05:20:02.998Z"),
                }, 
                {
                    kind : "warehouse",
                    timestamp : Date("2019-11-28T05:20:02.998Z"),
                }, 
                {
                    kind : "truck",
                    timestamp : Date("2019-11-29T05:20:02.998Z"),
                }
            ],
            weight : 55,
        });
        pkg.save() //takes some time and returns a promise
            .then(() => {
                assert(!pkg.isNew); //if poke is saved to db it is not new
                done();
            });
    });

});