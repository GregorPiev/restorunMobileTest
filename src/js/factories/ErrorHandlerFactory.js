'use strict';
const swal = require('sweetalert');
/**
 * Interceptor for catching response codes
 * @param $injector
 * @param $q
 */
module.exports = ($injector, $q) => {
    const _defaultMessage = 'תקלה לא ידועה, אנא נסה מאוחר יותר';
    const _errorAlert = (message) => {
        swal({
            title: 'תקלה...',
            text: message,
            timer: 3000,
            showConfirmButton: true,
            type: 'error'
        });
    };
 
    const _canNotCreateReservationAlert = (message) => {
        swal({
            title: 'לא ניתן ליצור הזמנה',
            text: message,
            //timer: 3000,
            showConfirmButton: true,
            type: 'warning'
        });
    };

    return {
        responseError: (response) => {
            const $state = $injector.get('$state');
            
            switch (response.status) {
                case 401:
                    $state.go('main.login');
                    break;

                case 301:
                    break;

                case 403:
                    $state.go('main.login');
                    break;

                case 500:
                    _errorAlert(_defaultMessage);
                    break;

                case 409:
                 
                    if (response && response.data && response.data.Message) {
                    
                        break;
                       // _canNotCreateReservationAlert(response.data.Message);
                    } else {
                 
                        _canNotCreateReservationAlert(_defaultMessage);
                    }
                    break;
                default:
                    if (response && response.data && response.data.Message) {
                         _errorAlert(response.data.Message);
                    } else {
                        _errorAlert(_defaultMessage);
                    }
                    break;
            }

            return $q.reject(response);
        }
    };
};
