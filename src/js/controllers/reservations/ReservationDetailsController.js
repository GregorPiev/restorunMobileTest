'use strict';
const swal = require('sweetalert');
const moment = require('moment');

module.exports = ($scope, $rootScope, $state, $stateParams, reservation, reservationStatus, ReservationService, LookupService, $timeout, $compile) => {
  /**private Functions */
  //debugger;
  let newMessage = {};
  let priorityChoosePlace = 0;

  const _messageToObj = (_message) => {

    const _getOpt = (opt) => {
      const _splitedOpt = opt.split('\n');

      const _rowToObj = (row) => {
        let _result = {};
        const _rData = row.replace(':', '').match(/\S+\s*/g);

        for (let i = 0; _rData.length > i; i++) {
          if (_rData[i].trim().length > 1) {
            let key = _rData[i].trim().replace(':', '');
            let val = _rData[++i].trim().replace(/\"*/g, "");
            _result[key] = val;
          }
        }

        return _result;
      }

      let _optRows = [];

      _splitedOpt.forEach((row, index) => {
        if (row !== '') {
          _optRows.push({
            link: ` <a data-ng-click="resvate(${index})" class="toComp"> ${row} </a>`,
            index: index,
            data: _rowToObj(row)
          });
        }
      });
      return _optRows
    };

    const buildFinalMessage = (obj) => {
      var text = `<div>${obj.title}</br> </br> ${obj.subTitle}</br></br> `;

      obj.options
        .forEach((options) => {
          text += `${options.link}</br></br>`;
        });
      text += '</div>';
      return text;
    }

    const splited = _message.split('\r\n\r\n');


    let newMessage = {
      title: splited[0],
      subTitle: splited[1],

    }

    newMessage.options = _getOpt(splited[2]);
    newMessage.text = buildFinalMessage(newMessage);

    return newMessage;

  };

  const _canNotCreateReservationAlert = (message) => {

    if (message === "No available seats") {
      newMessage.text = message;
    } else {
      newMessage = _messageToObj(message);
    }

    swal({
      title: 'לא ניתן ליצור הזמנה',
      // text: message,
      text: newMessage.text,
      html: true,
      //timer: 3000,
      showConfirmButton: true,
      type: 'warning',

    });

    setTimeout(function () {
      $compile($('.toComp'))($scope);
    }, 100);
  };

  /**
   * public functions
   */
  $scope.reservation = reservation;
  $scope.reservationStatus = reservationStatus;

  if (($scope.reservation) && ($scope.reservation.logicalArea) && (!$scope.reservation.logicalArea.remark)) {
    $scope.reservation.logicalArea.remark = "";
  }

  $scope.resvate = (index) => {
    const time = newMessage.options[index].data['בשעה'].split(':');
    const date = newMessage.options[index].data['בתאריך'].split('/');
    const _showSuccessSwat = () => {
      swal({
        title: 'פרטי ההזמנה עוכנו בהצלחה!',
        text: "אנא לחץ על שליחה",
        timer: 2000,
        showConfirmButton: false,
        type: 'success',
        showLoaderOnConfirm: true,
        allowEscapeKey: false
      });
    };

    //update the date
    const _area = _.find($scope.logicalAreas, (o) => {
      return o.name.trim() === newMessage.options[index].data['באיזור'];
    });

    //update the date
    const _table = _.find($scope.tables, (o) => {
      return o.name.trim() === newMessage.options[index].data['בשולחן'];
    });

    $scope.reservation.reservationDateTime = new Date(date[2], date[1], date[0], time[0], time[1]);
    $scope.reservation.logicalArea = _area;
    $scope.reservation.tables = _table;
    _showSuccessSwat();

  }

  //Initialize
  $scope.isEditing = false;
  $scope.minDate = reservation.reservationDateTime || new Date();
  $scope.temp = {};
  $scope.temp.selectedComment = '';
  if (!$scope.errors) {
    $scope.errors = {};
  }

  $scope.durations = [
    { duration: new Date(1800000), name: '00:30' },
    { duration: new Date(3600000), name: '01:00' },
    { duration: new Date(5400000), name: '01:30' },
    { duration: new Date(7200000), name: '02:00' },
    { duration: new Date(9000000), name: '02:30' },
    { duration: new Date(10800000), name: '03:00' },
    { duration: new Date(12600000), name: '03:30' },
    { duration: new Date(14400000), name: '04:00' },
    { duration: new Date(16200000), name: '04:30' },
    { duration: new Date(18000000), name: '05:00' },
    { duration: new Date(19800000), name: '05:30' },
    { duration: new Date(21600000), name: '06:00' },
    { duration: new Date(23400000), name: '06:30' },
    { duration: new Date(25200000), name: '07:00' },
    { duration: new Date(27000000), name: '07:30' },
    { duration: new Date(28800000), name: '08:00' },
    { duration: new Date(30600000), name: '08:30' },
    { duration: new Date(32400000), name: '09:00' },
    { duration: new Date(34200000), name: '09:30' },
    { duration: new Date(36000000), name: '10:00' },
    { duration: new Date(37800000), name: '10:30' }
  ];


  //Functions
  $scope.initializeLookups = () => {
    $scope.logicalAreas = $rootScope.lookups.logicalAreas;
    $scope.tables = $rootScope.lookups.tables;
    $scope.commentsBank = $rootScope.lookups.commentsBank;
    $scope.occasions = $rootScope.lookups.occasions;
    $scope.referrers = $rootScope.lookups.referrers;
  };

  $scope.isNewReservation = false;
  if ($state && $state.params && ($state.params.isNewReservation || $state.params.ReservationId === "")) {
    $scope.isNewReservation = true;
    if ($scope.reservation.smokingPreferences === undefined) {
      $scope.reservation.smokingPreferences = 0;
    }
    var date = new Date();
    if ($rootScope.selectedDate) {
      $scope.reservation.reservationDateTime = $rootScope.selectedDate;
    } else {
      $scope.reservation.reservationDateTime = new Date(date.setHours(date.getHours() + 1));
    }
  }

  if ((!$scope.isNewReservation) && ($scope.reservation) && ($scope.reservation.id)) {
    ReservationService.getReservationDetailsById(reservation.id).then(
      function (response) {
        if (response) {
          $scope.reservation = response;
        }
      },
      function (error) {
        //console.log(error.message);
      }
    );
  }

  /**
   * listeners
   */
  $scope.$watch(function () {
    return $scope.reservation.reservationDateTime;
  }, function (newVal, oldVal) {
    $rootScope.$broadcast('thisTime', $scope.reservation.reservationDateTime);
    if (newVal !== oldVal) {
      if (newVal === undefined) {
        $scope.reservation.reservationDateTime = new Date(date.setHours(date.getHours() + 1));
      }
      $rootScope.currentTime = $scope.reservation.reservationDateTime;
    }
  });

  $scope.$on('newTimeSelected', (event, data) => {
    //console.log('Elena - Log - newTimeSelected');
    $rootScope.currentTime = $scope.reservation.reservationDateTime = data.newTime;
    $scope.getAvailableTables($rootScope.currentTime);
  });

  $scope.makeReservation = (form) => {
    //console.log('Elena - Log - makeReservation');
    $scope.errors.visible = false;
    if (!form || form.$valid) {
      $scope.disableButtons = true;
      ReservationService.makeReservation($scope.reservation)
        .then((response) => {
          var waitingTime = 10000;
          swal({
            title: 'הזמנה נוצרה בהצלחה!',
            text: "מייד תעבור לרשימת הזמנות",
            timer: waitingTime,
            showConfirmButton: false,
            type: 'success',
            showLoaderOnConfirm: true,
            allowEscapeKey: false
          });
          $timeout(() => {
            $state.go('main.reservations-list');
          }, waitingTime);
        })
        .catch((err) => {

          if (err.status === 409) {
            _canNotCreateReservationAlert(err.data.Message);
          }

          $scope.disableButtons = false;
        });
    } else {
      $scope.errors.visible = true;
    }
  };

  $scope.getAvailableTables = (reservationDateTime) => {
    //console.log('%cElena - Log - getAvailableTables', "color:red;font-weght:bold;font-size:24px;");
    //2017-06-19 15:50:00
    let reservation = {
      "reservationDateTime": moment(reservationDateTime).format('YYYY-MM-DD HH:mm:ss')
    };
    //debugger;
    // let reservation = {'reservationDateTime': reservationDateTime};
    LookupService.getAvailableTablesForReservation(reservation)
      .then(
      function successCallback(response) {
        $scope.tables = response;
        //ADD CURRENT TABLE IF STILL WITHIN DURATION OF THE ORIGINAL TIME
        //COMMENTED OFF TO AVOID CONDITION WHERE NEW TIME MIGHT OVERRIDE ANOTHER RESERVATION

        // if ($scope.isEditing) {

        //     var reservationDurationObject = moment($scope.reservation.reservationDuration).toObject();

        //     var reservationEnd = moment($scope.originalReservationDateTime);
        //     reservationEnd.add(reservationDurationObject.hours, 'hours');
        //     reservationEnd.add(reservationDurationObject.minutes, 'minutes');

        //     var newReservationTime = moment(reservationDateTime);

        //     var diff = reservationEnd.diff(newReservationTime);
        //     console.log(diff > 0)
        //     if (diff > 0) {

        //         // var newReservationTimeObject = reservationEnd.toObject();
        //         var newReservationEndTime = newReservationTime;
        //         newReservationEndTime.add(reservationDurationObject.hours, 'hours');
        //         newReservationEndTime.add(reservationDurationObject.minutes, 'minutes');

        //         var newReservation = {
        //             "reservationDateTime": newReservationEndTime.format('YYYY-MM-DD HH:mm:ss')
        //         };
        //         LookupService.getAvailableTablesForReservation(newReservation).then(
        //             function (response) {
        //                 var tblCount = $scope.originalReservationTables.length;
        //                 for (let resTable of $scope.originalReservationTables) {
        //                     var continueToNextTable = false
        //                     for (let availableTable of response) {
        //                         if (resTable.tableID == availableTable.tableID) {
        //                             tblCount--;
        //                             continueToNextTable = true;
        //                         }
        //                     }
        //                     if (!continueToNextTable) {
        //                         return;
        //                     }
        //                 }
        //                 if (tblCount == 0) {
        //                     $scope.addCurrentReservationTables();
        //                     return;
        //                 }
        //             },
        //             function error(error) {
        //                 console.log(error.message);
        //             }
        //         );

        //     }

        // }
      },
      function (error) {
        //console.log(error);
      });
    // return $scope.tables;
  };

  $scope.isReservationEditable = (reservation) => {
    // return (($stateParams.reservationStatus == 1) && (reservation.reservationDateTime >= new Date()));
    return ((reservationStatus == 1) && (reservation.reservationDateTime >= new Date()));
  };

  $scope.isEditable = $scope.isReservationEditable($scope.reservation);
  $scope.selectedLogicalArea = { id: 0 };

  $scope.tablesAdded = false;
  $scope.addCurrentReservationTables = function () {
    // if (!$scope.tablesAdded) {
    var tablesToAdd = [];
    var resTables = []
    for (let tbl of $scope.originalReservationTables) {
      //get rid of multiple tables in a single table name
      if (tbl.name.indexOf(',') > -1) {
        tbl.name = tbl.name.split(',')[0];
      }
      //match lookup tables list data with reservation tables data
      for (let lookupTable of $scope.lookups.tables) {
        if (lookupTable.tableID == tbl.tableID) {
          resTables.push(lookupTable);
        }
      }
    }
    //replace reservation tables list with new tables list from lookup
    $scope.reservation.table = resTables;
    // $scope.originalReservationTables = angular.copy(resTables);

    for (let tbl of resTables) {
      var isTableAlreadyInScope = false;
      for (let scopeTable of $scope.tables) {
        if (scopeTable.tableID == tbl.tableID) {
          isTableAlreadyInScope = true;
        }
      }
      if (!isTableAlreadyInScope) {
        tablesToAdd.push(tbl);
      }
    }

    $scope.tables = $scope.tables.concat(tablesToAdd);
    // $scope.tables = $scope.tables.concat($scope.originalReservationTables);

    $scope.tablesAdded = true;
    // }
  }

  $scope.editReservation = () => {
    $scope.isEditing = true;

    $scope.reservation.customer.id = $scope.reservation.customer.customerID;

    $scope.originalReservationDateTime = angular.copy($scope.reservation.reservationDateTime);
    $scope.originalReservationTables = angular.copy($scope.reservation.table);

    $scope.addCurrentReservationTables();

    $scope.selectedLogicalArea.id = $scope.reservation.logicalArea.id;

  }

  $scope.formatTableName = (tableName) => {
    //debugger;
    return (tableName.split(',')[0]);
  }

  $scope.updateReservation = (form) => {
    $scope.errors.visible = false;
    if (($scope.reservation.reservationDateTime > new Date()) && (!form || form.$valid)) {
      $scope.disableButtons = true;
      ReservationService.makeReservation($scope.reservation)
        .then((response) => {
          var waitingTime = 3000;
          $scope.isEditing = false;
          swal({
            title: 'ההזמנה עודכנה בהצלחה!',
            text: "מיד תועברו לרשימת הזמנות",
            timer: waitingTime,
            showConfirmButton: false,
            type: 'success',
            showLoaderOnConfirm: true,
            allowEscapeKey: false
          });
          $timeout(() => {
            $state.go('main.reservations-list');
          }, waitingTime);
        })
        .catch((err) => {

          if (err.status === 409) {
            _canNotCreateReservationAlert(err.data.Message);
          }

          $scope.disableButtons = false;
        });
    } else {
      $scope.errors.visible = true;
    }
  }

  $scope.continueToNextStep = (form) => {
    $state.go('main.reservation.details-more', { ReservationId: reservation.id });
  };

  $scope.onBackBtnClick = () => {
    if ($scope.isEditing) {
      $state.reload();
    } else {
      $state.go('main.reservations-list');
    }
  }


  //Watchers
  $scope.$watch('selectedLogicalArea.id', function (newVal, oldVal) {
    //debugger;
    //if ((newVal != oldVal) && (priorityChoosePlace != 1)) {
    if (newVal != oldVal) {
      for (let rla of $scope.logicalAreas) {
        if ($scope.selectedLogicalArea.id == rla.id) {
          $scope.reservation.logicalArea = rla;
        }
      }
    }
    //priorityChoosePlace = 0;
  }, true);

  $scope.initializeLookups();
  $scope.$on('lookupsLoaded', () => {
    //console.log('Elena - Log - lookupsLoaded');
    $scope.initializeLookups();
  });

  $scope.$watch('reservation.table', (newValue) => {
    if (typeof newValue != "undefined") {
      //priorityChoosePlace = 1;
      $scope.selectedLogicalArea.id = newValue[0].logicalAreaID;
    }
  });

  $scope.$watch('temp.selectedComment', (newValue) => {
    //console.log('Elena - Log - selectedComment');
    if (newValue === '' || !newValue) {
      return;
    }

    if ($scope.reservation.comment) {
      $scope.reservation.comment = $scope.reservation.comment + ', ' + newValue.text;
    } else {
      $scope.reservation.comment = newValue.text;
    }

    $scope.temp.selectedComment = '';
  });

  $scope.dateChangeHandler = () => {
    //debugger;
    $scope.getAvailableTables($scope.reservation.reservationDateTime);
  }

  $scope.getAvailableTables($scope.reservation.reservationDateTime);
};
