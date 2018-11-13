const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
let Config = require('../config/constants');
global.C = new Config();
const Utils = require('../lib/commonUtils');

describe('Common utilities lib', () => {
    describe('calculateDistance()', () => {
        it('should return distance between origin and destination', () => {
            Utils.calculateDistance(["23", "72"], ["28", "79"]).then(data => {
                expect(data.distanceValue).equal(1071943);
            });
        });
        it('should return an error due to wrong coordinates', () => {
            Utils.calculateDistance(["2", "72"], ["28", "79"]).then(null, err => {
                expect(err.message).equal('Result error: ZERO_RESULTS');
            });
        });
    });

    describe('isValidMongoId()', () => {
        it('should return true for valid mongo id', () => {
            let validity = Utils.isValidMongoId('5beb36e29828252f4c1a9876');
            expect(validity).equal(true);
        });
        it('should return true for invalid mongo id', () => {
            let validity = Utils.isValidMongoId('51234');
            expect(validity).equal(false);
        });
    });
});

describe('Constants initialisation', () => {
    it('should have port defined', () => {
        let Config = require('../config/constants');
        const C = new Config();
        expect(C.defaultPort).equal(8080);
    });
});