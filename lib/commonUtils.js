const Q = require('q');
const mongoose = require('mongoose');

module.exports = {

    /**
     * Google api to calculate distance
     * @param {*} origin 
     * @param {*} destination 
     */
    calculateDistance: function (origin, destination) {
        let distance = require('google-distance');
        distance.apiKey = C.googleMapsKey;
        let deferred = Q.defer();

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

    isValidMongoId: function (id) {
        return mongoose.Types.ObjectId.isValid(id);
    },
}