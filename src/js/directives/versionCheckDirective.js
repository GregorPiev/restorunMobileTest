'use strict';

const angular = require('angular');

module.exports = (ngIfDirective, LookupService, $rootScope) => {

    var ngIf = ngIfDirective[0];

    return {
        scope: {
            fromVersion: '='
        },
        transclude: ngIf.transclude,
        priority: ngIf.priority,
        terminal: ngIf.terminal,
        restrict: ngIf.restrict,
        link: function ($scope, $element, $attr) {
            var _showFromVersion = $attr['fromVersion'] || LookupService.getGlobalShowFromVersion();
            if (!_showFromVersion) {
                _showFromVersion = LookupService.getGlobalShowFromVersion();
            }
            // var _showFromVersion = fromVersion;
            var _showNewFeatures = LookupService.getNewFeatures(_showFromVersion);

            $attr.ngIf = function () {
                return LookupService.getNewFeatures(_showFromVersion);
            };

            ngIf.link.apply(ngIf, arguments);

            $rootScope.$on('versionUpdated', () => {
                ngIf.link.apply(ngIf, arguments);
            });
        }
    }
};
