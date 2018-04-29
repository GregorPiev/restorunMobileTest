'use strict';

module.exports = ($scope, $stateParams, RegistrationService, $timeout, $state) => {

    if ($stateParams.MembershipVerificationToken) {
        $scope.token = {
            MembershipVerificationToken: $stateParams.MembershipVerificationToken
        };

        RegistrationService.verifyToken($scope.token)
            .then((response) => {
                $scope.showSuccessMsg = true;

                $timeout(() => {
                    $state.go('main.login');
                }, 8000);
            })
            .catch((error) => {
                $scope.showValidationErr = true;
            });
    }
    else {
        $scope.showTokenErr = true;
    }
};