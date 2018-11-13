const Q = require('q');
const orderModel = require('../models/OrderModel');
const {
    validate
} = require('jsonschema');
const Utils = require('../../lib/commonUtils');

module.exports = {

    add: function (req, res) {

        let deferred = Q.defer();
        let createOrderValidator = require("../validations/createOrder.json");
        const validation = validate(req.body, createOrderValidator);

        if (!validation.valid) {
            let error = {status: 400, message: 'INVALID_PARAMETERS'};
            deferred.reject(error);
            return deferred.promise;
        }

        Utils.calculateDistance(req.body.origin, req.body.destination).then(totalDistance => {

            let order = orderModel({
                distance: totalDistance.distanceValue,
                status: C.orderStatuses.UNASSIGNED,
                origin: req.body.origin,
                destination: req.body.destination,
                createdAt: new Date(),
                updatedAt: new Date()
            });
    
            order.save((err, newOrder) => {
                if (err) {
                    let error = {status: 500, message: err.message};
                    deferred.reject(error);
                } else {
                    deferred.resolve({
                        id: newOrder._id,
                        distance: parseInt(newOrder.distance),
                        status: newOrder.status
                    });
                }
            });
        }, err => {
            let error = {status: 500, message: err.message};
            deferred.reject(error);
        }).catch(err => {
            let error = {status: 500, message: err.message};
            deferred.reject(error);
        })

        return deferred.promise;
    },

    patch: function (req, res) {

        let deferred = Q.defer();
        let updateOrderValidator = require("../validations/updateOrder.json");
        const validation = validate(req.body, updateOrderValidator);

        if (req.body.status !== 'TAKEN' || !validation.valid || !Utils.isValidMongoId(req.params.id)) {
            let error = {status: 400, message: 'INVALID_PARAMETERS'};
            deferred.reject(error);
            return deferred.promise;
        }

        let query = { _id: req.params.id, status: C.orderStatuses.UNASSIGNED };
        let update = { status: C.orderStatuses.TAKEN };
        let options = { new: false };
    
        orderModel.findOneAndUpdate(query, update, options, function(err, orderData) {
    
            if(err) {
    
                deferred.reject(err);
            } else if(!orderData || orderData === []) {

                let error = {status: 404, message: 'Order id is not available for updation'};
                deferred.reject(error);
            } else {
    
                deferred.resolve({status: 'SUCCESS'});
            }
        });

        return deferred.promise;
    },

    list: function (req, res) {

        let deferred = Q.defer();
        let listOrderValidator = require("../validations/listOrder.json");
        const validation = validate(req.query, listOrderValidator);

        if (!validation.valid || req.query.page <= 0 || req.query.limit <= 0) {
            let error = {status: 400, message: 'INVALID_PARAMETERS'};
            deferred.reject(error);
            return deferred.promise;
        }
        let page = parseInt(req.query.page), limit = parseInt(req.query.limit);

        let fields = {distance: 1, status: 1};
        let orderData = [];
        orderModel.find(null, fields, {skip: ((page-1) * limit), limit: limit}).cursor().on('data', data => {
            let datum = data.toObject();
            datum.id = datum._id;
            delete datum._id;
            orderData.push(datum);
        }).on('close', () => {
            deferred.resolve(orderData);
        })

        return deferred.promise;
    },
};