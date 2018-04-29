'use strict';

/**
 * All frontend factories
 * @type {{errorHandler: *[]}}
 */
module.exports = {
    errorHandler: ['$injector', '$q', require('./factories/ErrorHandlerFactory')],
    apiFactory: ['Restangular', 'User', require('./factories/ApiFactory')]
};