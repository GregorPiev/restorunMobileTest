'use strict';

/**
 * All frontend providers
 * @type {{User: *[]}}
 */
module.exports = {
    User: ['$localStorageProvider', require('./providers/UserProvider')]
};