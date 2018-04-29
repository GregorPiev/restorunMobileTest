'use strict';

module.exports = ($scope, $rootScope, $state) => {    
    //Initialize
    $scope.customer = {};
    if (!$scope.errors) {
        $scope.errors = {};
    }

    //Functions
    $scope.showDisable = (event, $timeout) => {
        console.info(event.target.parentNode);
        let curObj = angular.element(event.target.parentNode);
        curObj.addClass('input-disabled');

        let removeClass = () => {
            curObj.removeClass('input-disabled');
        };
        window.setTimeout(removeClass, 2000);

    };
    $scope.addCustomer = (form) => {
        $scope.errors.visible = false;
        if (form.$valid) {
            $scope.customer.fullName = $scope.customer.firstName + ' ' + $scope.customer.lastName;
            $scope.reservation.customer = $scope.customer;
            $state.go('main.reservation.new');
        } else {
            $scope.errors.visible = true;    
        }
    };

    $scope.initializeLookups = () => {
        $scope.customerTypes = $rootScope.lookups.customerTypes;
    };

    //Watchers
    $scope.initializeLookups();
    $scope.$on('lookupsLoaded', () => {
        $scope.initializeLookups();
    });
};
