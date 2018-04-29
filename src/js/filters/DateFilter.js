'use strict';

const moment = require('moment');
const angular = require('angular');

/**
 * This filter should be implemented in the entire system,
 * this is the current format of date and time display
 * @returns Valid Date
 */
module.exports = ($filter) => {
    return (items, props) => {
        let defaultFilter, itemsToMoment, format, firstValue, regex;

        defaultFilter = {
            'datetime': false, // Is it a datetime? or just date
            'fullhourformat': true,  // should we display full hour format ? (21:00, 22:00, etc )
            'testexp': false  // should check if datetime / date pass in regex?
        };

        // extend it from passed variables
        props = angular.extend(defaultFilter, props);

        // save original value
        firstValue = items;

        // if no value return null
        if (!items) {
            return '';
        }

        // regex to determine if its date time
        regex = /([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?/;
        if (props.testexp) {
            // if value is not date or datetime return original name
            if (!regex.test(items)) {
                return items;
            }
        }

        // Not a datetime format
        format = "DD/MM/YYYY";

        // test if datetime format required
        if (props.datetime) {
            // Format with AM/PM
            format = "DD/MM/YYYY";

            // Is it full format of date
            if (props.fullhourformat) {
                format = "DD/MM/YYYY H:mm";
            }
        }

        if (props.testexp) {
            items = items.replace(regex, (str) => {
                let itemsToMoment = moment(Date.parse(str)).format(format);
                return (itemsToMoment === 'Invalid date') ? str : itemsToMoment;
            });
            return items;
        }

        // use moment to convert it to valid format
        itemsToMoment = moment(Date.parse(items)).format(format);
        // return to user check if date is valid if not return original value

        return (itemsToMoment === 'Invalid date') ? firstValue : itemsToMoment;
    };
}; 