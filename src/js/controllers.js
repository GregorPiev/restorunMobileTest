'use strict';

/**
 * All Frontend controllers
 */
module.exports = {
  LayoutController: ['$scope', '$rootScope', 'User', '$window', 'LookupService', '$previousState', '$uibModal', require('./controllers/LayoutController')],
  CustomerDetailsController: ['$scope', '$rootScope', '$state', 'customer', require('./controllers/customers/CustomerDetailsController')],
  CustomerSearchController: ['$scope', '$rootScope', '$state', 'CustomerService', require('./controllers/customers/CustomerSearchController')],
  ReservationDetailsController: ['$scope', '$rootScope', '$state', '$stateParams', 'reservation', 'reservationStatus', 'ReservationService', 'LookupService', '$timeout', '$compile', require('./controllers/reservations/ReservationDetailsController')],
  ReservationsListController: ['$scope', '$rootScope', 'LookupService', 'ReservationService', '$localStorage', '$timeout', 'RESTORUN_VERSION', require('./controllers/reservations/ReservationsListController')],
  LoginController: ['$scope', 'User', '$state', '$location', 'AuthenticationService', '$stateParams', '$localStorage', '$http', 'LookupService', require('./controllers/LoginController')],
  CustomerNewController: ['$scope', '$rootScope', '$state', require('./controllers/customers/CustomerNewController')]
};
