'use strict';

const angular = require('angular');

module.exports = ($scope, User, $state, $location, AuthenticationService, $stateParams, $localStorage, $http, LookupService) => {

    $scope.login = {};
    $scope.forgot = {};
    $scope.reset = {};

    $scope.errors = {
        visible: false,
        message: 'An error occurred.'
    };

    $scope.$on('$stateChangeStart', () => {
        // Reset errors between states.
        $scope.errors.visible = false;
    });

    $scope.connect = () => {

        // $http.get('https://api.chucknorris.io/jokes/random').then(
        //     (response) => {
        //         console.log('$http.get: ' + response.data.value);
        //     },
        //     (error) => {
        //         console.log(error.toString());
        //     }
        // );

        // $http({
        //     method: 'POST',
        //     url: 'http://mobile.restorun.co.il/api/account/authenticate',
        //     data: $scope.login,
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         "Access-Control-Allow-Origin": "http://rest.anv.co.il"
        //     }
        // })
        // .then(
        //     (response) => {
        //         console.log(response);
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );



        AuthenticationService.connect($scope.login)
            .then((response) => {
                $state.go('main.reservations-list');
                $localStorage.reservationsListSearchParams = undefined;
                // AuthenticationService.getVersion().then((response) => {
                LookupService.getVersion();
                // console.log(response);
                // });
            }).catch((error) => {
                $scope.errors = {
                    visible: true,
                    message: error.data.Message
                };
            });
    };

    $scope.displayErrors = () => {
        $scope.errors.visible = true;
    };
};
