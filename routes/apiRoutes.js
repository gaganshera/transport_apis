const resp = require('../lib/responseHandler');

module.exports = function (app, router) {
    
    app.use('/', router);

    router.post('/orders', (req, res) => {
        let orders = require('../orders/controllers/orderController');
        orders.add(req, res).then(function(response) {

            resp.responseWithSuccess(req, res, response, 201);
        }, function(err) {

            resp.responseWithError(req, res, err);
        })
    });

    router.patch('/orders/:id', (req, res) => {
        let orders = require('../orders/controllers/orderController');
        orders.patch(req, res).then(function(response) {

            resp.responseWithSuccess(req, res, response);
        }, function(err) {

            resp.responseWithError(req, res, err);
        })
    });

    router.get('/orders', (req, res) => {
        let orders = require('../orders/controllers/orderController');
        orders.list(req, res).then(function(response) {

            resp.responseWithSuccess(req, res, response);
        }, function(err) {

            resp.responseWithError(req, res, err);
        })
    });
};