'use strict';

/**
 * All frontend services
 */
module.exports = {
    AuthenticationService: ['apiFactory', 'User', require('./services/AuthenticationService')],
    CustomerService: ['apiFactory', 'User', require('./services/CustomerService')],
    LookupService: ['apiFactory', 'User', '$localStorage', '$rootScope', '$http', require('./services/LookupService')],
    ReservationService: ['apiFactory', 'User', 'CustomerService', '$rootScope', require('./services/ReservationService')]
};