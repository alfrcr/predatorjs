'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = withValidator;

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign2 = require('lodash/assign');

var _assign3 = _interopRequireDefault(_assign2);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _findIndex = require('lodash/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _titleCase = require('title-case');

var _titleCase2 = _interopRequireDefault(_titleCase);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // Inspired by react-redux's `connect()` HOC factory function implementation:

function mapRules(rules) {
  (0, _invariant2.default)(rules, '\n    PredatorJS: Form rules should be string divided by |.\n    For example: required|alphanumeric|min:6|max:12\n  ');

  return (0, _map2.default)(rules.split('|'), function (rule) {
    if (rule.indexOf('min:') !== -1 || rule.indexOf('max:') !== -1) {
      var minMax = rule.split(':');
      return (0, _assign3.default)({}, _defineProperty({ type: minMax[0] }, minMax[0], minMax[1]));
    }

    return (0, _assign3.default)({}, { type: rule });
  });
}

var defaultMessages = {
  required: '{form} can not be empty',
  email: '{form} is not valid',
  url: '{form} is not a valid URL',
  ip: '{form} is not a valid IP',
  date: '{form} is not a valid date',
  bool: '{form} is not boolean',
  alpha: '{form} only alphabet allowed',
  num: '{form} only numbers allowed.',
  alphanumeric: '{form} only alphabet and number are allowed',
  min: '{form} minimal length is {value} characters',
  max: '{form} maximal length is {value} characters'
};

function withValidator(rules, messages) {
  var createFormState = (0, _map2.default)((0, _keys2.default)(rules), function (form) {
    return {
      name: form,
      message: '',
      value: '',
      rules: mapRules(rules[form])
    };
  });

  var createMessageState = typeof messages !== 'undefined' ? (0, _assign3.default)({}, defaultMessages, messages) : (0, _assign3.default)({}, defaultMessages);

  return function wrapWithValidator(WrappedComponent) {
    (0, _invariant2.default)(typeof WrappedComponent === 'function', 'You must pass a component to the function returned by withValidator.');

    var getDisplayName = function getDisplayName(name) {
      return 'Validator(' + name + ')';
    };

    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    var displayName = getDisplayName(wrappedComponentName);

    var Validator = function (_Component) {
      _inherits(Validator, _Component);

      function Validator(props) {
        _classCallCheck(this, Validator);

        var _this = _possibleConstructorReturn(this, (Validator.__proto__ || Object.getPrototypeOf(Validator)).call(this, props));

        _this.onInitValidate = function (selector) {
          var form = document.querySelectorAll(selector + ' input:not(button):not(hidden):not(file)');
          var event = new Event('input', { bubbles: true });

          (0, _forEach2.default)(form, function (f) {
            return setTimeout(function () {
              return f.dispatchEvent(event);
            }, 10);
          });
        };

        _this.getErrorMessage = function (key) {
          var form = _this.state.form;

          var errFound = (0, _filter2.default)(form, function (f) {
            return f.name === key;
          }).length > 0;
          return errFound ? (0, _filter2.default)(form, function (f) {
            return f.name === key;
          })[0].message : '';
        };

        _this.getErrorMessages = function () {
          var form = _this.state.form;

          return (0, _filter2.default)(form, function (f) {
            return !_validator2.default.isEmpty(f.message);
          }).map(function (f) {
            return {
              name: f.name,
              message: f.message
            };
          });
        };

        _this.validate = function (key, value) {
          var form = _this.state.form;

          var index = (0, _findIndex2.default)(form, function (data) {
            return data.name === key;
          });
          var newForm = (0, _reactAddonsUpdate2.default)(form[index], { value: { $set: value } });
          var newState = (0, _reactAddonsUpdate2.default)(form, { $splice: [[index, 1, newForm]] });

          _this.setState(_extends({}, _this.state, { form: newState }), function () {
            _this.validating(index);
          });
        };

        _this.validating = function (index) {
          var form = _this.state.form[index];

          /* Make sure value is String */
          var value = form.value + '';
          var formName = (0, _titleCase2.default)(form.name);
          var resetMessage = _this.formatMessage(index, '');

          (0, _forEach2.default)(form.rules, function (rule) {
            switch (rule.type) {
              case 'required':
                return _validator2.default.isEmpty(value) ? _this.formatMessage(index, _this.buildMessage('required', formName)) : resetMessage;
              case 'email':
                return value && !_validator2.default.isEmail(value) ? _this.formatMessage(index, _this.buildMessage('email', formName)) : resetMessage;
              case 'url':
                return value && !_validator2.default.isURL(value) ? _this.formatMessage(index, _this.buildMessage('url', formName)) : resetMessage;
              case 'ip':
                return value && !_validator2.default.isIP(value) ? _this.formatMessage(index, _this.buildMessage('ip', formName)) : resetMessage;
              case 'date':
                return value && !_validator2.default.isDate(value) ? _this.formatMessage(index, _this.buildMessage('date', formName)) : resetMessage;
              case 'bool':
                return value && !_validator2.default.isBoolean(value) ? _this.formatMessage(index, _this.buildMessage('bool', formName)) : resetMessage;
              case 'alpha':
                return value && !_validator2.default.isAlpha(value) ? _this.formatMessage(index, _this.buildMessage('alpha', formName)) : resetMessage;
              case 'num':
                return value && !_validator2.default.isNumeric(value) ? _this.formatMessage(index, _this.buildMessage('num', formName)) : resetMessage;
              case 'alphanumeric':
                return value && !_validator2.default.isAlphanumeric(value) ? _this.formatMessage(index, _this.buildMessage('alphanumeric', formName)) : resetMessage;
              case 'min':
                return value && value.length < rule.min ? _this.formatMessage(index, _this.buildMessage('min', formName, rule.min)) : resetMessage;
              case 'max':
                return value && value.length > rule.max ? _this.formatMessage(index, _this.buildMessage('max', formName, rule.max)) : resetMessage;
              default:
                return resetMessage;
            }
          });
        };

        _this.buildMessage = function (rule, formName, extraFields) {
          var formMessages = _this.state.formMessages;

          var mapValue = {
            '{form}': formName,
            '{value}': extraFields
          };

          return typeof extraFields !== 'undefined' ? formMessages[rule].replace(/{form}|{value}/g, function (match) {
            return mapValue[match];
          }) : formMessages[rule].replace('{form}', formName);
        };

        _this.formatMessage = function (index, message) {
          var form = _this.state.form;

          var newMessage = (0, _reactAddonsUpdate2.default)(form[index], { message: { $set: message } });
          var newState = (0, _reactAddonsUpdate2.default)(form, { $splice: [[index, 1, newMessage]] });

          _this.setState(_extends({}, _this.state, { form: newState }), function () {
            _this.formIsValid();
          });
        };

        _this.formIsValid = function () {
          var form = _this.state.form;

          var errCount = (0, _filter2.default)(form, function (f) {
            return f.message !== '';
          }).length;
          var required = (0, _filter2.default)(form, function (f) {
            return (0, _filter2.default)(f.rules, function (r) {
              return r.type === 'required';
            }).length > 0;
          });
          var uncomplete = (0, _filter2.default)(required, function (r) {
            return r.value === '';
          }).length;

          _this.setState(_extends({}, _this.state, { formIsValid: errCount === 0 && uncomplete === 0 }));
        };

        _this.state = {
          form: createFormState,
          formMessages: createMessageState,
          formIsValid: false
        };
        return _this;
      }

      /* Get error message by key */


      /* Get all messages with form name and rules */


      /*
       *  Validate form
       *  The purpose of this method is
       *  to disable or enable submit button
       */


      _createClass(Validator, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
            onInitValidate: this.onInitValidate,
            validate: this.validate,
            getErrorMessage: this.getErrorMessage,
            getErrorMessages: this.getErrorMessages,
            formIsValid: this.state.formIsValid
          }));
        }
      }]);

      return Validator;
    }(_react.Component);

    Validator.WrappedComponent = WrappedComponent;
    Validator.displayName = displayName;

    return (0, _hoistNonReactStatics2.default)(Validator, WrappedComponent);
  };
}