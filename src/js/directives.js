'use strict';

/**
 * All frontend directives
 * @type {{}}
 */
// module.exports = {
//     // compareTo: [require('./directives/CompareToDirective')],
//     // passwordStrength: [require('./directives/PasswordStrengthDirective')],
//     // onEnterDirective: [require('./directives/OnEnterDirective')],
//     // rangeDatePickerDirective: ['$compile', '$parse', '$filter', require('./directives/RangeDatePickerDirective')],
//     // inputResizeDirective: [require('./directives/InputResizeDirective')],
//     // validateEmail: ['RegistrationService', require('./directives/validateEmailDirective')]
// };
module.exports = {
    versionCheck: ['ngIfDirective', 'LookupService', '$rootScope', require('./directives/versionCheckDirective')],
    customVersionCheck: ['ngIfDirective', 'LookupService', '$rootScope', require('./directives/customVersionCheckDirective')]
};
