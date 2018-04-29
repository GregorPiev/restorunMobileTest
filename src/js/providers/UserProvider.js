'use strict';

/**
 * User provider class
 * @param $localStorageProvider
 */
module.exports = function ($localStorageProvider, $state) {

    // user model
    let _user = {
        fullname: 'Alex B'
    };

    // jwt token
    let _jwtToken;

    // const _getJwt = () => {
    //     var auth = $localStorageProvider.get('Authorization');
    //     return _jwtToken || $localStorageProvider.get('Authorization');
    // };

    // const _logout = () => {
    //     _jwtToken = null;
    //     delete $localStorageProvider.Authorization;
    //     $localStorageProvider.Authorization = null;
    // };

    // this.getJwt = _getJwt;

    /**
     * Section for service
     * @type {*[]}
     */
    this.$get = ['$localStorage', 'Restangular', '$state', ($localStorage, Restangular, $state) => {

        const _logout = () => {
            _jwtToken = null;
            delete $localStorage.Authorization;
            delete $localStorage.version;
            $state.go('main.login');
        };

        const _getJwt = () => {
            return _jwtToken || $localStorage.Authorization;
        }

        /**
         * Set jwt
         * @param jwt
         * @private
         */
        const _setJwt = (jwt) => {
            _jwtToken = jwt;
            $localStorage.Authorization = jwt;
        };

        /**
         * Set user
         * @param user
         * @private
         */
        const _setUser = (user) => {
            _user = user;
        };

        /**
         * get user
         * @returns {*}
         * @private
         */
        const _getUser = () => {
            return _user;
        };

        /**
         * Get Full name
         * @returns {*}
         * @private
         */
        const _getFullName = () => {
            return _user.fullname;
        };

        /**
         * get user name
         * @returns {*}
         * @private
         */
        const _getUserName = () => {
            return _user.username;
        };

        const _getPermissions = () => {
            return _user.permissions;
        };

        /**
         * final return
         */
        return {
            getJwt: _getJwt,
            setJwt: _setJwt,
            setUser: _setUser,
            getUser: _getUser,
            getFullName: _getFullName,
            getUserName: _getUserName,
            getPermissions: _getPermissions,
            logout: _logout
        };
    }];

};
