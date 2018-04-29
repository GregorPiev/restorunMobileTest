'use strict';

module.exports = (apiFactory, UserProvider, CustomerService, $rootScope) => {

    const _getReservationDetailsById = (ReservationID) => {
        return apiFactory.all('Reservation').one('GetReservationDetailsById', ReservationID).customPOST()
            .then((response) => {
                return response.plain();
            });
    };

    const _getReservationTimeLine = (reservationDateTime) => {
        //console.log('%cGregory - ReservationService.js, BusinessDate: ' + JSON.stringify(reservationDateTime), "color:green;font-size:14px;");
        return apiFactory.all('Reservation').all('GetTimeLine').customPOST({ ReservationDateTime: reservationDateTime })
            .then((response) => {
                //console.log('%Gregory - ReservationService.js, in Responce: ' + JSON.stringify(response), "color:green;font-size:14px;");
                return response.plain();
            });
    };

    const _getReservationsByParamsPaged = (Date, PageNum, SearchParam, ReservationStatusID, ReservationLogicalAreaID, DayPeriod) => {
        PageNum = PageNum || 1;
        return apiFactory.all('Reservation').all('searchReservation').customPOST({
            pageNum: PageNum,
            searchParam: SearchParam,
            date: Date,
            status: ReservationStatusID,
            reservationLogicalArea: ReservationLogicalAreaID,
            dayPeriod: DayPeriod
        })
            .then((response) => {
                return response.plain();
            });
    };

    const _makeReservation = (Reservation) => {
        return apiFactory.all('Reservation').all('makeReservation').customPOST({
            reservation: Reservation
        })
            .then((response) => {
                return response.plain();
            });
    };

    const _cancelReservation = (reservation) => {
        let req = {
            "id": reservation.id,
            "WebCustomer": null,
            "WebID": null
        };

        let resID = $rootScope.lookups.tables[0].restorunId;
        req.restaurantID = resID

        return CustomerService.searchCustomer(reservation.customerName, 1)
            .then((response) => {
                if (response) {
                    let customer = response[0];
                    req.customerID = customer.customerID;

                    return apiFactory.all('Reservation').all('cancelReservation').customPOST({
                        "restaurantID": req.restaurantID,
                        "customerID": req.customerID,
                        "id": req.id,
                        "WebCustomer": null,
                        "WebID": null
                    })
                        .then((response) => {
                            return response.plain();
                        });
                }
            })
    }

    return {
        getReservationsByParamsPaged: _getReservationsByParamsPaged,
        getReservationDetailsById: _getReservationDetailsById,
        makeReservation: _makeReservation,
        cancelReservation: _cancelReservation,
        getReservationTimeLine: _getReservationTimeLine
    };
};
