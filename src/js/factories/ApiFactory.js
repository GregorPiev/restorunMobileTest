'use strict';

module.exports = (Restangular, User) => {

    return Restangular.withConfig((c) => {
        /**
         * Interceptor for responses
         * Server may return new token inside the Authorization header (for longer expiration time)
         */
        c.addResponseInterceptor((data, operation, what, url, response, deferred) => {
            if (response.headers('Authorization')) {
                User.setJwt(response.headers('Authorization'));
            }
            //console.info("%cGregory ApiFactory.js  What:" + what, "color: red;font-size: 18px;");
            //console.log('%cGregory - ApiFactory.js Respone: ' + JSON.stringify(response), "color:green;font-size:14px;");
            return response.data;
        });

        /**
         * Interceptor for request
         * Set Authorization header in case exists in local storage
         */
        c.addFullRequestInterceptor((headers, params, element, httpConfig, sendHeaders) => {
            const Auth = User.getJwt();
            if (Auth) {
                sendHeaders.Authorization = Auth;
            }
            // c.setDefaultHeaders({ 'Access-Control-Allow-Origin': 'http://restorun.info' });
            // sendHeaders['Access-Control-Allow-Origin'] = 'http://restorun.info';
            // headers['Access-Control-Allow-Origin'] = 'http://restorun.info';
            // sendHeaders['Access-Control-Allow-Origin'] = 'http://mobile.restorun.co.il';
            // headers['Access-Control-Allow-Origin'] = 'http://mobile.restorun.co.il';
            // sendHeaders['Access-Control-Allow-Credentials'] = 'true';
            // headers['Access-Control-Allow-Credentials'] = 'true';
            // sendHeaders['Access-Control-Allow-Headers'] = 'Accept, X-Requested-With';
            // headers['Access-Control-Allow-Headers'] = 'Accept, X-Requested-With';

            // sendHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
            // headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
        });

        // c.setDefaultHeaders({
        //     'Access-Control-Allow-Origin': 'http://rest.anv.co.il',
        //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        //     'Access-Control-Allow-Headers': 'Accept, X-Requested-With',
        //     'Access-Control-Allow-Credentials': 'true'
        // });
    });

};
