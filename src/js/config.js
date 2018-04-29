'use strict';
const angular = require('angular');
const moment = require('moment');
module.exports = (RestangularProvider, $httpProvider, cfpLoadingBarProvider, $locationProvider, $localStorageProvider) => {

  /**
   * Section for provider
   */
  $localStorageProvider.setKeyPrefix('restorunApp');

  RestangularProvider.setBaseUrl('/api');
  // RestangularProvider.setBaseUrl('http://mobile.restorun.co.il/api');
  cfpLoadingBarProvider.includeSpinner = false;

  /**
   * Interceptor for request response
   */
  $httpProvider.interceptors.push('errorHandler');

  /**
   * Set html5 mode.
   */
  // $locationProvider.html5Mode(true).hashPrefix('!');

  //JSON dates handling
  Date.prototype.toJSON = function () { return moment(this).format(); };

  const convertDates = (input) => {
    for (var key in input) {
      if (!input.hasOwnProperty(key)) {
        continue;
      }

      if (typeof input[key] === 'object') {
        { convertDates(input[key]); }
      } else {
        if (typeof input[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(input[key])) {
          input[key] = moment(input[key]).toDate();
        }
      }
    }
  };

  $httpProvider.defaults.transformResponse.push(function (responseData) {
    convertDates(responseData);
    return responseData;
  });
  //JSON dates handling
};
