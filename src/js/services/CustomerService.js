'use strict';

module.exports = (apiFactory, UserProvider) => {

    const _getCustomerDetailsById = (CustomerID) => {
        return apiFactory.all('customer').one('getCustomerDetailsById', CustomerID).customPOST()
            .then((response) => {
                return response.plain();
            });
    };

    const _searchCustomer = (SearchParam, PageNum) => {
        PageNum = PageNum || 1;
        return apiFactory.all('customer').all('searchCustomer').customPOST({
                PageNum: PageNum,
                SearchParam: SearchParam
            })
            .then((response) => {
                return response.plain();
            });
    };

    return {
        searchCustomer: _searchCustomer,
        getCustomerDetailsById: _getCustomerDetailsById
    };
};
