'use strict';

module.exports = ($scope, $rootScope, $state, CustomerService) => {

    //Initialize
    $scope.inputMode = 'text';
    $scope.searchParams = {
        searchParam: undefined,
        pageNum: 1
    };
    $scope.stopSearch = false;
    $scope.fetch = false;
    $scope.isLookingForNumber = false;


    //Functions
    $scope.toggleSearchMode = () => {
        $scope.inputMode = $scope.inputMode === 'text' ? 'number' : 'text';
        $scope.searchParams.searchParam = undefined;
    };

    $scope.addCustomer = (customer) => {
        $scope.reservation.customer = customer;
        $scope.reservation.customer.id = $scope.reservation.customer.customerID; //TODO: /* This shall be removed, when object expected with new reservation will be the same as sent here!!!!!*/ 

        $state.go('main.reservation.new');
    };

    $scope.getCustomers = () => {
        if (!$rootScope.isAuthenticated) {
            return;
        }

        if ($scope.searchParams.searchParam && !$scope.stopSearch) {
            $scope.fetch = true;

            CustomerService.searchCustomer($scope.searchParams.searchParam, $scope.searchParams.pageNum)
                .then(result => {
                    $scope.searchResultsString = '';
                    if (result) {
                        if (result.length === 0) {
                            $scope.stopSearch = true;
                            if ($scope.customers.length > 0) {
                                $scope.searchResultsString = 'אין תוצאות נוספות';
                            } else {
                                $scope.searchResultsString = 'לא נמצאו תוצאות';
                            }
                            return;
                        }
                        $scope.customers = $scope.customers.concat(result);
                    }
                })
                .catch((e) => {
                    $scope.stopSearch = true;
                })
                .finally(() => {
                    $scope.fetch = false;
                });
        }
        $scope.searchParams.pageNum++;
    };

    //Watchers
    $scope.$watch('searchParams.searchParam', (newValue) => {
        $scope.customers = [];
        $scope.searchParams.pageNum = 1;
        $scope.stopSearch = false;
        $scope.isLookingForNumber = isFinite(parseInt(newValue));
        $scope.getCustomers();
    });
};
