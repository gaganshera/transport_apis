module.exports = function() {

    let constants = {
        googleMapsKey: 'AIzaSyB8eziG4kBKXmbv1x27T2dRCw6wqtevKsU',
        defaultPort : 8080,
        mongodbConnection : "mongodb://mongo/transport_apis",
        orderStatuses: {'UNASSIGNED': 'UNASSIGNED', 'TAKEN': 'TAKEN'}
    };
    return constants;
};
