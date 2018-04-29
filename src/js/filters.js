'use strict';

module.exports = {
    DateFilter: ['$filter', require('./filters/DateFilter')],
    SearchWrapFilter: ['$filter', require('./filters/SearchWrapFilter')],
    MomentFilter: ['$filter', require('./filters/MomentFilter')],
    TestNumberTables: ['$filter', require('./filters/TestNumberTables')]
};
