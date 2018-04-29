'use strict';

const angular = require('angular');

module.exports = (ngIfDirective, LookupService, $rootScope) => {

    var ngIf = ngIfDirective[0];

    return {
        transclude: ngIf.transclude,
        priority: ngIf.priority,
        terminal: ngIf.terminal,
        restrict: ngIf.restrict,
        link: function($scope, $element, $attr) {
            var _showFromVersion = $attr['fromVersion'];
            // var _showFromVersion = $scope.$eval(value);
            var _version = LookupService.getVersion();
            var _show = LookupService.compareVersions(_version, _showFromVersion) >= 0;

            $attr.ngIf = function() {
                return _show;
            };

            ngIf.link.apply(ngIf, arguments);

            $rootScope.$on('versionUpdated', function() {
                 _version = LookupService.getVersion();
                 _show = LookupService.compareVersions(_version, _showFromVersion) >= 0;
                ngIf.link.apply(ngIf, arguments);
            })
        }
    }
};
