'use strict';

module.exports = (apiFactory, UserProvider, $localStorage, $rootScope, $http) => {

    // let _version = $localStorage.version;
    var _serverVersion = $localStorage.version;
    var _showFromVersion; //FROM THIS VERSION NEW FEATUES WILL BE SHOWN

    const _compareVersions = function (a, b) {
        var i, cmp, len, re = /(\.0)+[^\.]*$/;
        a = (a + '').replace(re, '').split('.');
        b = (b + '').replace(re, '').split('.');
        len = Math.min(a.length, b.length);
        for (i = 0; i < len; i++) {
            cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
            if (cmp !== 0) {
                return cmp;
            }
        }
        return a.length - b.length;
    }

    const _getLookups = () => {
        return apiFactory.all('lookup').all('GetRestorunLookups').customPOST()
            .then((response) => {
                return response.plain();
            });
    };

    const _getAvailableTablesForReservation = (reservationDateTime) => {
        //console.log('%cElena - LoockupService.js, reservationDateTime: ' + JSON.stringify(reservationDateTime), "color:green;font-size:14px;");
        return apiFactory.all('lookup').all('GetAvailableTablesForReservation').customPOST(reservationDateTime)
            .then((response) => {
                //console.log('%cElena - LoockupService.js, in Respone: ' + JSON.stringify(response),"color:green;font-size:14px;");
                return response.plain();
            });
    };



    const _getVersion = () => {
        _getGlobalShowFromVersion();
        let v = _serverVersion || $localStorage.version;
        if (v) {
            return v;
        }
        else {
            return apiFactory.all('lookup').all('GetVersion').customPOST()
                .then((response) => {
                    // console.log(response.plain());
                    if (response.status === 1) {
                        _serverVersion = response.version;
                        $localStorage.version = _serverVersion;
                        $rootScope.$broadcast('versionUpdated');
                        return _serverVersion;
                    }
                });
        };
    }

    const _getNewFeatues = (versionInput) => {
        if (versionInput) {
            _showFromVersion = versionInput;
        }
        return _compareVersions(_serverVersion, _showFromVersion) >= 0;
    }

    const _getGlobalShowFromVersion = () => {
        if (_showFromVersion) {
            return _showFromVersion;
        }
        else {
            // $http.get('resources/config.json').then(
            //     function(response) {
            //         // console.log(response);
            //         _showFromVersion = response.data.config.showFromVersion;
            //         $rootScope.$broadcast('globalShowFromVersionUpdated');
            //         return _showFromVersion;
            //     },
            //     function(error) {
            //         console.log(error);
            //     }
            // );

            _showFromVersion = '2.5.5';
            $rootScope.$broadcast('globalShowFromVersionUpdated');
            return _showFromVersion;
        }
    }

    return {
        getLookups: _getLookups,
        getAvailableTablesForReservation: _getAvailableTablesForReservation,
        getVersion: _getVersion,
        getNewFeatures: _getNewFeatues,
        compareVersions: _compareVersions,
        getGlobalShowFromVersion: _getGlobalShowFromVersion
    };
};
