'use strict';

module.exports = ($scope, $rootScope, $state, customer) => {
    //console.log("%cGregory. CustomerDetailsController Customer values:" + JSON.stringify(customer),"color: darkviolet;font-size:12px;");
    $scope.customer = customer;
};
