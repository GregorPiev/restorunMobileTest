'use strict';

const moment = require('moment');
const swal = require('sweetalert');

module.exports = ($scope, $rootScope, LookupService, ReservationService, $localStorageProvider, $timeout, RESTORUN_VERSION) => {

  //Initialize
  $scope.showStates = {
    status: false,
    graph: false,
    search: false
  };
  $scope.ReservationDateTime = '';

  $scope.pageNum = 1;
  $scope.stopSearch = false;
  $scope.reservations = [];
  $scope.fetch = false;
  $scope.searchResultsString = '';
  $scope.reservationTimeLineData = [];
  $scope.currentTotalReservations = '';
  $scope.currentSumOfPartySize = '';
  $scope.currentTimelineName = "מחוץ לשרות";
  $scope.curentTime = "00:00";
  $scope.StatusRuler = [{ "timelineName": "צהריים", "details": [] }, { "timelineName": "ערב", "details": [] }, { "timelineName": "לילה", "details": [] }];
  $scope.StatusRulerView = false;
  $scope.shiftTotalReservations = [0, 0, 0];
  $scope.shiftSumOfPartySize = [0, 0, 0];

  let currentVersion = ($localStorageProvider.version) ? ($localStorageProvider.version).split(".") : ["2", "5", "4", "19325"];
  //let currentVersion = ["2", "5", "4", "19325"];
  let currentNumberVersion = currentVersion[0] * 100 + currentVersion[1] * 10 + currentVersion[2] * 1;
  let compareVersion = RESTORUN_VERSION.split(".");
  let compareNumberVersion = compareVersion[0] * 100 + compareVersion[1] * 10 + compareVersion[2] * 1;
  let versionUpdated = (currentNumberVersion >= compareNumberVersion) ? true : false;




  if ($localStorageProvider.reservationsListSearchParams) {
    var tmp = JSON.parse($localStorageProvider.reservationsListSearchParams);
    tmp.date = moment(tmp.date).toDate();
    //debugger;
    $scope.searchParams = tmp;
  } else {
    //debugger;
    $scope.searchParams = {
      date: new Date(),
      searchParam: undefined,
      reservationStatus: undefined,
      reservationLogicalArea: undefined,
      dayPeriod: undefined //TODO: When sending, insert selected day period
    };
  }

  //Functions
  $rootScope.getDateForDisplay = (date) => {
    //debugger;
    return moment(date).calendar(new Date(), {
      sameDay: '[היום], DD/MM/YYYY',
      nextDay: '[מחר], DD/MM/YYYY',
      nextWeek: 'DD/MM/YYYY',
      lastDay: '[אתמול], DD/MM/YYYY',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  };

  $scope.$watch(function () {
    return $scope.searchParams.date;
  }, function (newVal, oldVal) {
    if (newVal !== oldVal && newVal == undefined) {
      var date = new Date();
      //debugger;
      $scope.searchParams.date = new Date(date.setHours(date.getHours() + 1));
    }
  });

  $scope.close = (controlName) => {
    $scope.showStates[controlName] = false;
    angular.element(".invitation_list").css("margin-top", "32px");
    return;
  };

  $scope.toggle = (controlName, arr, isCheckbox, $event) => {
    let isOpen;
    if (isCheckbox) {
      isOpen = !$scope[arr][controlName];
    } else {
      isOpen = $scope[arr][controlName];
    }
    if (isOpen) {
      angular.element(".invitation_list").css("margin-top", "32px");
    } else {
      if ($event.target.id == "status") {
        angular.element(".invitation_list").css("margin-top", "32px");
      } else {
        angular.element(".invitation_list").css("margin-top", "90px");
      }
    }

    for (var property in $scope[arr]) {
      if (property === controlName) {
        $scope[arr][property] = !isOpen;
      } else if (!isOpen) {
        $scope[arr][property] = false;
      }
    }
  };

  $scope.getReservations = () => {
    //debugger;
    if (!$rootScope.isAuthenticated) {
      return;
    }
    if ($scope.searchParams && !$scope.stopSearch) {
      $scope.fetch = true;
      $scope.searchResultsString = '';
      var pageNum = angular.copy($scope.pageNum);
      ReservationService.getReservationsByParamsPaged(
        $scope.searchParams.date,
        $scope.pageNum,
        $scope.searchParams.searchParam,
        $scope.searchParams.reservationStatus,
        $scope.searchParams.reservationLogicalArea,
        $scope.searchParams.dayPeriod
      )
        .then(result => {

          if ($scope.searchParams.reservationStatus == 4) {
            var statusFourResults = result;
            ReservationService.getReservationsByParamsPaged(
              $scope.searchParams.date,
              pageNum,
              $scope.searchParams.searchParam,
              9,
              $scope.searchParams.reservationLogicalArea,
              $scope.searchParams.dayPeriod)
              .then((result) => {
                //console.log(result);
                if (result) {
                  var totalResults = statusFourResults.concat(result);
                  if (totalResults.length === 0) {
                    if ($scope.reservations.length > 0) {
                      $scope.searchResultsString = 'אין תוצאות נוספות';
                    } else {
                      $scope.searchResultsString = 'לא נמצאו תוצאות';
                    }
                    $scope.stopSearch = true;
                    return;
                  }
                  $scope.reservations = $scope.reservations.concat(totalResults);
                }

              })
              .catch((e) => {
                $scope.stopSearch = true;
              })
              .finally(() => {
                $scope.fetch = false;
              });
          }
          else if (result) {
            if (result.length === 0) {
              if ($scope.reservations.length > 0) {
                $scope.searchResultsString = 'אין תוצאות נוספות';
              } else {
                $scope.searchResultsString = 'לא נמצאו תוצאות';
              }
              $scope.stopSearch = true;
              return;
            }
            $scope.reservations = $scope.reservations.concat(result);
          }
        })
        .catch((e) => {
          $scope.stopSearch = true;
        })
        .finally(() => {
          $scope.fetch = false;
        });
    }
    $scope.pageNum++;
  };

  $scope.confirmCancelReservation = (reservation) => {
    if ($scope.isReservationCancelPermit(reservation)) {
      swal({
        title: "ביטול הזמנה",
        text: "האם לבטל את ההזמנה? הפעולה אינה הפיכה",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ביטול הזמנה",
        cancelButtonText: "חזרה לרשימת הזמנות",
        closeOnConfirm: false
      },
        function () {
          $scope.cancelReservation(reservation);
        });
    }
  };

  $scope.cancelReservation = (reservation) => {
    // if ($scope.isReservationCancellable(reservation)) {
    // let c = window.confirm("האם לבטל את ההזמנה?");
    // if (c) {
    ReservationService.cancelReservation(reservation)
      .then((response) => {
        if (response.reservationRequestResultCode == "OK") {
          reservation.status = {
            id: 4,
            name: "Cancelled",
            description: "מבוטל"
          };
          var waitingTime = 3000;
          swal({
            title: 'ההזמנה בוטלה בהצלחה!',
            text: "מיד תוחזרו לרשימת הזמנות",
            timer: waitingTime,
            showConfirmButton: false,
            type: 'success',
            showLoaderOnConfirm: true,
            allowEscapeKey: false
          });
          $timeout(() => {
            $state.reload();
          }, waitingTime);
        }
      })
      .catch((e) => {
        //console.log(e.data);
      });
    // }
    // }
  };
  $scope.isReservationCancelPermit = (reservation) => {
    var permit = (reservation.status.id == 1 || reservation.status.id == 2 || reservation.status.id == 8 || reservation.status.id == 11);
    return permit;
  };

  $scope.isReservationCancellable = (reservation) => {
    var permit = ((reservation.status.id == 1 || reservation.status.id == 2 || reservation.status.id == 8 || reservation.status.id == 11) && (reservation.reservationDateTime >= new Date()));
    return permit;
  };

  $scope.initializeLookups = () => {
    $scope.reservationStatuses = $rootScope.lookups.reservationStatuses;
    for (let rs in $scope.reservationStatuses) {
      // if ($scope.reservationStatuses[rs].id == 4) {
      //     $scope.reservationStatuses[rs].id = [4,9];
      // }
      if ($scope.reservationStatuses[rs].id == 9) {
        $scope.reservationStatuses.splice(rs, 1);
      }
    }
    $scope.logicalAreas = $rootScope.lookups.logicalAreas;
    $scope.tables = $rootScope.lookups.tables;
    $scope.timePeriods = $rootScope.lookups.timePeriod;
  };

  $scope.setTimePeriod = (timePeriodsID) => {
    $scope.searchParams.dayPeriod = $scope.searchParams.dayPeriod === timePeriodsID ? undefined : timePeriodsID;
  };

  $scope.getWidth = () => {
    return 100 / Math.max($scope.timePeriods.length, 1) + '%';
  };

  $scope.logout = () => {
    $rootScope.$broadcast('logout');
  };


  //Watchers
  $scope.initializeLookups();
  $scope.$on('lookupsLoaded', () => {
    $scope.initializeLookups();
  });

  $scope.$watch('searchParams', () => {
    $scope.reservations = [];
    $scope.pageNum = 1;
    $scope.stopSearch = false;
    //debugger;
    $scope.getReservations();
    $localStorageProvider.reservationsListSearchParams = JSON.stringify($scope.searchParams);
  }, true);

  $scope.dateChangeHandler = () => {
    $rootScope.selectedDate = $scope.searchParams.date;
  };

  $scope.goHome = () => {
    $scope.searchParams.searchParam = undefined;
    $scope.searchParams.reservationStatus = undefined;
    $scope.searchParams.reservationLogicalArea = undefined;
    $scope.searchParams.dayPeriod = undefined;
    $scope.searchParams.pageNum = undefined;
    $scope.searchParams.status = undefined;
  };

  //Gregory. Set values on first load application.
  $scope.getTimeTimeLine = function () {
    let _dateTime = new Date();
    let _hours = (_dateTime.getHours() < 10) ? ("0" + _dateTime.getHours()) : _dateTime.getHours();
    let _minute = (_dateTime.getMinutes() < 10) ? ("0" + _dateTime.getMinutes()) : _dateTime.getMinutes();
    let _year = _dateTime.getFullYear();
    let _day = _dateTime.getDate();
    let _month = _dateTime.getMonth() + 1;
    $scope.ReservationDateTime = _year + "-" + _month + "-" + _day + " 00:00:00";
    $scope.curentTime = _hours + ":" + _minute;
  };

  //Gregory. Set values on event clicl on box in order to show timeline ruler
  $scope.renewTimeTimeLine = function () {
    let _dateTime = new Date();
    let _hours = (_dateTime.getHours() < 10) ? ("0" + _dateTime.getHours()) : _dateTime.getHours();
    let _minute = (_dateTime.getMinutes() < 10) ? ("0" + _dateTime.getMinutes()) : _dateTime.getMinutes();
    let _year = _dateTime.getFullYear();
    let _day = _dateTime.getDate();
    let _month = _dateTime.getMonth() + 1;
    $scope.ReservationDateTime = _year + "-" + _month + "-" + _day + " 00:00:00";
    $scope.curentTime = _hours + ":" + _minute;
    $scope.StatusRulerView = ($scope.StatusRulerView == false) ? true : false;
    //Require service only in case timeline ruler would be viewed.
    if ($scope.StatusRulerView === true) {
      //debugger;
      $scope.reservationTimeLine($scope.ReservationDateTime);
    }
    //debugger;
    $scope.searchParams.date = _dateTime;
    $scope.getDateForDisplay(_dateTime);
    angular.element(document.getElementById("arrow-custom")).hide("slow");
  };

  //Gregory. Set values on event clicl on box in order to show timeline ruler
  $scope.restoreTimeTimeLine = function () {
    let _dateTime = new Date();
    let _hours = (_dateTime.getHours() < 10) ? ("0" + _dateTime.getHours()) : _dateTime.getHours();
    let _minute = (_dateTime.getMinutes() < 10) ? ("0" + _dateTime.getMinutes()) : _dateTime.getMinutes();
    let _year = _dateTime.getFullYear();
    let _day = _dateTime.getDate();
    let _month = _dateTime.getMonth() + 1;
    $scope.ReservationDateTime = _year + "-" + _month + "-" + _day + " 00:00:00";
    $scope.curentTime = _hours + ":" + _minute;
    //Require service only in case timeline ruler would be viewed.
    $scope.reservationTimeLine($scope.ReservationDateTime);
    //debugger;
    $scope.searchParams.date = _dateTime;
    $scope.getDateForDisplay(_dateTime);
    angular.element(document.getElementById("arrow-custom")).hide("slow");
  };

  //Change reservation list in case of click on timeline ruler.
  $scope.rollToChoosedTime = function (choosedTime, countReservations, sumOfPartySize, currentTimelineName) {
    //debugger;
    if (!countReservations)
      return false;

    //let _dateTime = new Date();
    let _year = choosedTime.getFullYear();
    let _day = choosedTime.getDate();
    let _month = choosedTime.getMonth() + 1;
    let _hours = choosedTime.getHours();
    let _minut = choosedTime.getMinutes();
    let _choosedShortTime = _hours + ":" + _minut;

    $scope.curentTime = _choosedShortTime;
    $scope.currentTotalReservations = countReservations;
    $scope.currentSumOfPartySize = sumOfPartySize;
    $scope.currentTimelineName = currentTimelineName;

    $scope.StatusRulerView = false;

    let _fullChoosedTime = choosedTime.getTime();

    $scope.rollContainer(_fullChoosedTime);
  };

  $scope.rollContainer = function (pointTime) {
    let _reservationCollection = angular.element(document.querySelectorAll("li.reservationCollection"));
    //console.table(_reservationCollection);

    $(".reservationCollection").show("fast");
    let currenReservationPartySize = 0;
    let currenReservationPartyQuintity = 0;
    let currentReservationId = 0;

    angular.forEach(_reservationCollection, function (item, ind) {

      //console.log("%cItem ID:" + item.id + "\tTimeStart: " + $(item).attr("data-timestart") + " \tDuration: " + $(item).attr("data-duration") + " \tStatus:" + $(item).attr("data-status") + "\tSize:" + $(item).attr("data-size"), "color: brown;");
      //debugger;
      let _curItemDuration = 0;
      let _timeStartParam = $(item).attr("data-timestart");
      let _curItemStartDate = new Date(_timeStartParam);
      let _curItemStart = _curItemStartDate.getTime();

      let _curItemEndDate = ($(item).attr("data-duration")).split(":");
      _curItemDuration = (_curItemEndDate[0] * 3600 + _curItemEndDate[1] * 60) * 1000;

      let _curItemEnd = _curItemStart + _curItemDuration;

      if (_curItemEnd < pointTime || $(item).attr("data-status") === "false") {
        $(angular.element(document.getElementById(item.id))).hide("slow");
      } else {
        if (item.id !== currentReservationId) {
          currentReservationId = item.id;
          currenReservationPartyQuintity++;
          currenReservationPartySize += parseInt($(item).attr("data-size"));
        }
      }
    });
    //console.info("%cStatistic \tQuintity:" + currenReservationPartyQuintity + "\tSize:" + currenReservationPartySize, "color:green");
    angular.element(document.getElementById("arrow-custom")).show("slow");
  };

  //Gregory. Require data from server that contain summarise of reservation orders to be
  //dispersed on timeline by node time with gap 15 minutes.
  $scope.reservationTimeLine = function (ReservationDateTime) {
    //debugger;
    if (!$rootScope.isAuthenticated) {
      return;
    }
    if (ReservationDateTime) {
      ReservationService.getReservationTimeLine(ReservationDateTime).then((result) => {
        //console.info("%cReservation Time Line Result Status:" + result, "color:darkviolet;font-size:14px;");
        $scope.reservationTimeLineData = result.timeLine;
        $scope.setStatusSummariseValues();
        $scope.setStatusRulerData();
      }).catch((e) => {
        //console.error("%cError result:" + e.message, "color:red;")
      });
    }
  };

  //Gregory. Watchers in order invoke reservationTimeLine function in case
  //ReservationDateTime variable has be changed.
  $scope.$watch('ReservationDateTime', (newValue) => {
    $scope.reservationTimeLine(newValue);
  });

  //Gregory. Set sumarise values 
  $scope.setStatusSummariseValues = function () {
    let _nowTime = new Date().getTime();

    angular.forEach($scope.reservationTimeLineData, function (value, key) {
      //debugger;
      $scope.shiftTotalReservations[key] = $scope.reservationTimeLineData[key].totalReservations;
      $scope.shiftSumOfPartySize[key] = $scope.reservationTimeLineData[key].sumOfPartySize;

      if (_nowTime >= $scope.reservationTimeLineData[key].timelineFromTime.getTime() && _nowTime <= $scope.reservationTimeLineData[key].timelineToTime.getTime()) {
        $scope.currentTotalReservations = $scope.reservationTimeLineData[key].totalReservations;
        $scope.currentSumOfPartySize = $scope.reservationTimeLineData[key].sumOfPartySize;
        $scope.currentTimelineName = $scope.reservationTimeLineData[key].timelineName;
      }
    });
  };

  //Gregory. It's destined to build arrays including values
  // in order to build timeline.
  $scope.setStatusRulerData = function () {
    //debugger;    
    let _period = 0;
    $scope.StatusRuler[_period].details = [];
    if ($scope.reservationTimeLineData.length > 0) {

      let _startWork = $scope.reservationTimeLineData[0].timelineFromTime.getTime();
      let _endWork = $scope.reservationTimeLineData[$scope.reservationTimeLineData.length - 1].timelineToTime.getTime();
      let _deltaTime = 900000;

      for (let itr = _startWork; itr <= _endWork; itr += _deltaTime) {
        let _curCellTime = new Date(itr);
        let _curMinute = (_curCellTime.getMinutes() < 10) ? ("0" + _curCellTime.getMinutes()) : _curCellTime.getMinutes();
        let _curHour = (_curCellTime.getHours() < 10) ? ("0" + _curCellTime.getHours()) : _curCellTime.getHours();
        let _curCellTimeAbs = _curCellTime.getTime();
        let _endSwift = $scope.reservationTimeLineData[_period].timelineToTime.getTime();

        if ((itr >= _endSwift) && (_period < $scope.reservationTimeLineData.length - 1)) {
          _period++;
          //console.info("%cPeriod:" + _period, "color:brown");
          $scope.StatusRuler[_period].details = [];
        }
        let tmpCell = {
          cellTime: _curHour + ":" + _curMinute,
          timelineTime: 0,
          countOfReservations: 0,
          sumOfPartySize: 0,
          arrId: []
        };

        $scope.reservationTimeLineData[_period].details.find(function (itemListDin) {
          if (itemListDin.timelineTime.getTime() == _curCellTimeAbs) {
            tmpCell.countOfReservations = itemListDin.countOfReservations;
            tmpCell.sumOfPartySize = itemListDin.sumOfPartySize;
            tmpCell.timelineTime = itemListDin.timelineTime;
          }
        });
        $scope.StatusRuler[_period].details.push(tmpCell);
      }
      //console.log($scope.StatusRuler);
    } else {
      let _startTimeDinner = 14400000;
      let index = 0;
      for (let itr = 0; itr <= 92; itr += 1) {
        let _deltaTime = itr * 900000;
        let _curCellTime = new Date(_startTimeDinner + _deltaTime);
        let _curMinute = (_curCellTime.getMinutes() < 10) ? ("0" + _curCellTime.getMinutes()) : _curCellTime.getMinutes();
        let _curHour = (_curCellTime.getHours() < 10) ? ("0" + _curCellTime.getHours()) : _curCellTime.getHours();
        let tmpCell = {
          cellTime: _curHour + ":" + _curMinute,
          countOfReservations: 0,
          sumOfPartySize: 0,
          timelineTime: 0
        };
        if (itr > 48 && itr < 76) {
          index = 1;
        } else if (itr >= 76) {
          index = 2;
        }

        $scope.StatusRuler[index].details.push(tmpCell);
      }
    }
  };

  $scope.testVersion = function () {
    return versionUpdated;
  };


  angular.element(document).ready(function () {
    let _curTime = new Date();
    if ($localStorageProvider.reservationsListSearchParams) {
      var tmp = JSON.parse($localStorageProvider.reservationsListSearchParams);
      tmp.date = moment(tmp.date).toDate();
      if (_curTime.getTime() > tmp.date.getTime()) {
        //debugger;
        $scope.searchParams.date = _curTime;
      }

    }

    if ($scope.ReservationDateTime == '') {
      $scope.getTimeTimeLine();
    }
  });
};
