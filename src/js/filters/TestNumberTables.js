'use strict';

module.exports = () => {
    return (tablesNumber) => {
        if (tablesNumber === '' || tablesNumber==='-' ){
            tablesNumber = '0';
        }
        return tablesNumber;
    };
};
