'use strict';

/**
 * Project routes
 * @param $stateProvider
 * @param $urlRouterProvider
 * @param RestangularProvider
 */
module.exports = ($stateProvider, $urlRouterProvider, RestangularProvider) => {

    $urlRouterProvider.otherwise('/reservations-list');

    $stateProvider
        .state('main', {
            url: '',
            abstract: true,
            template: '<div data-ui-view></div>',
            controller: 'LayoutController'
        })
        .state('main.reservations-list', {
            url: '/reservations-list',
            templateUrl: 'test/mobile.test/RestorunMobile/views/reservations-list.html',
            config: {
                authenticate: true
            },
            controller: 'ReservationsListController'
        })
        .state('main.reservation', {
            url: '/reservation/:ReservationId',
            sticky: true,
            template: '<div data-ui-view="content"></div>',
            abstract: true,
            resolve: {
                reservation: ['ReservationService', '$stateParams', (ReservationService, $stateParams) => {
                    if ($stateParams.ReservationId) {
                        return ReservationService.getReservationDetailsById(parseInt($stateParams.ReservationId));
                    }
                    return {};
                }]
            },
            controller: 'ReservationDetailsController'
        })
        .state('main.reservation.details', {
            url: '/details',
            config: {
                authenticate: true
            },
            views: {
                'content@main.reservation': {
                    templateUrl: 'test/mobile.test/RestorunMobile/views/reservation-details.html',
                }
            }
        })
        .state('main.reservation.details-more', {
            url: '/more-details',
            config: {
                authenticate: true
            },
            views: {
                'content@main.reservation': {
                    templateUrl: 'test/mobile.test/RestorunMobile/views/reservation-more-details.html'
                }
            }
        })
        .state('main.reservation.new', {
            url: '/new',
            config: {
                authenticate: true
            },
            params: {
                isNewReservation: true
            },
            views: {
                'content@main.reservation': {
                    templateUrl: 'test/mobile.test/RestorunMobile/views/reservation-details.html',
                }
            }
        })
        .state('main.reservation.customer-search', {
            url: '/add-customer',
            sticky: true,
            config: {
                authenticate: true
            },
            views: {
                'content@main.reservation': {
                    templateUrl: 'test/mobile.test/RestorunMobile/views/customer-search.html',
                    controller: 'CustomerSearchController'
                }
            }
        })
        .state('main.login', {
            url: '/login',
            templateUrl: 'test/mobile.test/RestorunMobile/views/login.html',
            config: {
                hideIfAuthenticated: true
            },
            controller: 'LoginController'
        })
        .state('main.reservation.customer-details', {
            url: '/customer-details/:CustomerId',
            config: {
                authenticate: true
            },
            resolve: {
                customer: ['CustomerService', '$stateParams', (CustomerService, $stateParams) => {
                    return CustomerService.getCustomerDetailsById(parseInt($stateParams.CustomerId));
                }]
            },
            views: {
                'content@main.reservation': {
                    templateUrl: 'test/mobile.test/RestorunMobile/views/customer-details.html',
                    controller: 'CustomerDetailsController'
                }
            },
        })
        .state('main.reservation.customer-new', {
            url: '/customer-new',
            config: {
                authenticate: true
            },
            views: {
                'content@main.reservation': {
                    templateUrl: 'test/mobile.test/RestorunMobile/views/customer-new.html',
                    controller: 'CustomerNewController'
                }
            }
        });


    // .state('main.access-denied', {
    //     url: '/access-denied',
    //     templateUrl: 'test/mobile.test/RestorunMobile/views/access_denied.html'
    // })
};
