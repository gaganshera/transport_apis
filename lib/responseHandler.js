let funcs = {
    /**
     * Erroneous Response 
     * @param {*} req 
     * @param {*} res 
     * @param {*} error 
     */
    responseWithError: function(req, res, error) {

        if(!error.status) {
            error.status = 500;
        }
        if(!error.body && !error.message) {
            error.body = "ERROR_OCCURRED";
        }
        res.status(error.status).send({error: error.body || error.message});
    },

    /**
     * Success response
     * @param {*} req 
     * @param {*} res 
     * @param {*} data 
     */
    responseWithSuccess: function(req, res, data, status) {

        res.status(status || 200).json(data);
    },
}
module.exports = funcs;
module.exports.bodyParserHandle = function(error, req, res, next) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
        funcs.responseWithError(req, res, {status: 400, message: 'Malformed expression'});
    }
}
module.exports.errorHandler = function(error, req, res, next) {
    console.log(error)
    funcs.responseWithError(req, res, {status: 500, message: 'Some error occurred'});
}