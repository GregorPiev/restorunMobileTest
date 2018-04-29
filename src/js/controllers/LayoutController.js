'use strict';
const angular = require('angular');

module.exports = ($scope, $rootScope, User, $window, LookupService, $previousState, $uibModal) => {


    /**
     * Logout the user and redirect to the site.
     */
    $scope.backToSite = () => {
        User.logout();
    };

    $scope.back = () => {
        $window.history.back();
    };

    $scope.toggleDatepicker = (e) => {
        //debugger;        
        let objInput = angular.element(e.target).siblings('input[type="date"]');
        //console.info("%cGregory Toggle Datepicker: " + objInput.prop('type'), "color: indigo");

        if (objInput.prop('type') !== 'date') {
            let datePicker = $rootScope.getDateForDisplay();
            //console.info("%cGregory Toggle Datepicker : datePicker" + datePicker, "color: darkviolet");
            datePicker.datepicker().datepicker("show");
            //angular.element(e.target).siblings('input[type="date"]').datepicker().datepicker("show");
        } else {
            objInput.click();
            objInput.focus();
            //angular.element(e.target).siblings('input[type="date"]').click();
            //angular.element(e.target).siblings('input[type="date"]').focus();
        }
    };

    $scope.toggleTimepicker = (e) => {

        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/timePicker-modal.html',
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {

                const coeff = 1000 * 60 * 5;

                const _initDate = () => {
                    let _date = new Date(new Date().setHours(new Date().getHours() + 1));  //or use any other date
                    $scope.currentTime = new Date(Math.round(_date.getTime() / coeff) * coeff);
                }

                const _updateSelectedDate = () => {
                    $scope.currentTime = $rootScope.currentTime;
                }

                if (!$rootScope.currentTime) {
                    _initDate();
                } else {
                    _updateSelectedDate()

                }

                //get settet the time from the reservationDetails
                $scope.$on('thisTime', (e, data) => {
                    $rootScope.currentTime = new Date(Math.round(data.getTime() / coeff) * coeff);
                });



                $scope.saveNewDate = () => {
                    $uibModalInstance.close($scope.currentTime);
                }
            }],
            size: 'sm'
        })

        modalInstance.result
            .then((time) => {
                $rootScope.$broadcast('newTimeSelected', { newTime: time });
            });

    };

    $rootScope.lookups = {};

    $scope.getLookups = () => {
        LookupService.getLookups()
            .then((response) => {
                $rootScope.lookups = response;
                $scope.$broadcast('lookupsLoaded');
                return $rootScope.lookups;
            });
    };


    $scope.$watch(() => {
        return $rootScope.isAuthenticated;
    }, (newValue) => {
        if (newValue) {
            $scope.getLookups();
        }
    });

};
