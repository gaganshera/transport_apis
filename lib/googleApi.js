const Q = require('q');
const distance = require('google-distance');
const appConstants = require('../config/constants');

module.exports = {

    /**
     * Google api to calculate distance
     * @param {*} origin 
     * @param {*} destination 
     */
    calculateDistance: function (origin, destination) {
        distance.apiKey = appConstants.googleMapsKey;
        const deferred = Q.defer();

        distance.get({
            index: 1,
            origin: origin.toString(),
            destination: destination.toString()
        },
        (err, data) => {
            if (err) {
                deferred.reject({status: 500, message: err.message})
            } else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    },
}