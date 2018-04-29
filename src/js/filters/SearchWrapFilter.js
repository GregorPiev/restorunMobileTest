'use strict';

module.exports = () => {
    return (string, searchString) => {
        if (!searchString || searchString === '' || !string) {
            return string;
        }
        return string.replace(searchString, '<b>' + searchString + '</b>');
    };
};
