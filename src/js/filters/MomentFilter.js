'use strict';

const moment = require('moment');

module.exports = () => {
    return (dateString, format) => {
        return moment(dateString).format(format);
    };
};
