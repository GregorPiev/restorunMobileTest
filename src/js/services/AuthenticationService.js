'use strict';

module.exports = (apiFactory, UserProvider) => {

  /**
   * Log in
   * @param data as json contains Email,Password
   * @returns {*}
   * @private
   */
    const _connect = (data) => {

        var headers = {
            "Access-Control-Request-Method": "GET", 
            "Access-Control-Allow-Origin": "http://restorun.info"
        };

        // return apiFactory.all("account").all("authenticate").customPOST(data, "", "", headers)
        return apiFactory.all("account").all("authenticate").customPOST(data)        
            .then((response) => {
                UserProvider.setJwt(response.accessToken);
                // _getVersion();
                return response.plain();
            });

        // var options = {
        //     headers: {
        //         "Access-Control-Request-Method": "GET", 
        //         "Access-Control-Allow-Origin": "*"
        //     }
        // };

        // var headers = {
        //     "Access-Control-Request-Method": "GET", 
        //     "Access-Control-Allow-Origin": "http://rest.anv.co.il"
        // };

        // return apiFactory.all("jokes").customGET("random","", headers)
        //     .then((response) => {
        //         // UserProvider.setJwt(response.accessToken);
        //         console.log('restangular.customGET: ' + response.data.value);
        //         return response.plain();
        //     });
    };

  /**
   * Log out
   * @private
   */
    const _disconnect = () => {
        UserProvider.logout();
        return;
    };  

    const _getVersion = () => {
        return apiFactory.all('LookUp').all('GetVersion').customPOST()
            .then( (response) => {
                console.log(response.plain());
                return response.version;
            });
    }

    return {
        connect: _connect,
        disconnect: _disconnect,
        getVersion: _getVersion
    };

};