const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
const appConstants = require('../config/constants');
const mongoValidate = require('../lib/mongooseValidate');

describe('Google Maps lib', () => {
    describe('calculateDistance()', () => {
        it('should return distance between origin and destination', (done) => {
            const googleApi = {
                calculateDistance: function(){}
            };
            const calculateDistanceStub = sinon.stub(googleApi, "calculateDistance")
                .resolves({distanceValue: 1071943});
            calculateDistanceStub(["23", "72"], ["28", "79"]).then(data => {
                expect(data.distanceValue).equal(1071943);
                done();
            });
        });
        it('should return an error due to wrong coordinates', (done) => {
            const googleApi = {
                calculateDistance: function(){}
            };
            const calculateDistanceStub = sinon.stub(googleApi, "calculateDistance")
                .rejects({message: 'Result error: ZERO_RESULTS'});
            calculateDistanceStub(["2", "72"], ["28", "79"]).then(null, err => {
                expect(err.message).equal('Result error: ZERO_RESULTS');
                done();
            });
        });
    });
});

describe('Constants initialisation', () => {
    it('should have port defined', () => {
        const appConstants = require('../config/constants');
        expect(appConstants.defaultPort).equal(8080);
    });
});

describe('Mongo validity', () => {
    describe('isValidMongoId()', () => {
        it('should return true for valid mongo id', () => {
            let validity = mongoValidate.isValidMongoId('5beb36e29828252f4c1a9876');
            expect(validity).equal(true);
        });
        it('should return true for invalid mongo id', () => {
            let validity = mongoValidate.isValidMongoId('51234');
            expect(validity).equal(false);
        });
    });
});

describe('Db connection', () => {
    it('should show db has conencted', (done) => {
        require('../lib/db');
        const mongoose = require('mongoose');
        mongoose.connection.on('connected', function(test){
            expect(mongoose.connection.readyState).equal(1);
            mongoose.disconnect()
            done();
        });
    });
});