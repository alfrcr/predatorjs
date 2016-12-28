'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var _titleCase = require('title-case');

var _titleCase2 = _interopRequireDefault(_titleCase);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-disable prefer-template, no-console */

var withValidator = function withValidator(rules, messages) {
  var validatorState = (0, _map2.default)((0, _keys2.default)(rules), function (form) {
    return {
      name: form,
      message: '',
      rules: (0, _map2.default)(rules[form].split('|'), function (rule) {
        if (rule.indexOf('min:') !== -1 || rule.indexOf('max:') !== -1) {
          var minMax = rule.split(':');
          return (0, _assign3.default)({}, _defineProperty({ type: minMax[0] }, minMax[0], minMax[1]));
        }

        return (0, _assign3.default)({}, { type: rule });
      })
    };
  });

  var requiredForm = (0, _filter2.default)((0, _keys2.default)(rules), function (form) {
    return rules[form].indexOf('required') !== -1;
  }).reduce(function (current, next) {
    current[next] = '';
    return current;
  }, {});

  var defaultMsg = {
    required: '{form} can not be empty',
    email: '{form} is not valid',
    url: '{form} is not a valid URL',
    ip: '{form} is not a valid IP',
    date: '{form} is not a valid date',
    bool: '{form} is not boolean',
    alpha: '{form} only alphabet allowed',
    num: '{form} only numbers allowed.',
    min: '{form} minimal length is {value} characters',
    max: '{form} maximal length is {value} characters'
  };

  var validatorMsg = (typeof messages === 'undefined' ? 'undefined' : _typeof(messages)) !== undefined ? (0, _assign3.default)({}, defaultMsg, messages) : (0, _assign3.default)({}, defaultMsg);

  var composed = function composed(ComposedComponent) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
      _inherits(Validator, _Component);

      function Validator(props) {
        _classCallCheck(this, Validator);

        var _this = _possibleConstructorReturn(this, (Validator.__proto__ || Object.getPrototypeOf(Validator)).call(this, props));

        _this.formErrorLogger = function (key) {
          console.error('Redator Error: ' + key + ' never been registered to the form rules.');
        };

        _this.validate = function (key, value) {
          var _this$state = _this.state,
              form = _this$state.form,
              required = _this$state.required;

          var index = (0, _findIndex2.default)(form, function (data) {
            return data.name === key;
          });
          var newState = (0, _reactAddonsUpdate2.default)(required, _defineProperty({}, key, { $set: value }));

          if (key in _this.state.required) {
            _this.setState(_extends({}, _this.state, { required: newState }), function () {
              _this.validating(form[index].rules, index, value);
            });
          } else {
            _this.validating(form[index].rules, index, value);
          }
        };

        _this.validating = function (formRules, index, formValue) {
          var form = _this.state.form;

          /* Make sure value is String */

          var value = formValue + '';

          var formName = (0, _titleCase2.default)(form[index].name);
          var resetMessage = _this.formatMessage(index, '');

          /* Iterate attached form rules */
          (0, _forEach2.default)(formRules, function (rule) {
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
          var messages = _this.state.messages;

          var mapValue = {
            '{form}': formName,
            '{value}': extraFields
          };

          return (typeof extraFields === 'undefined' ? 'undefined' : _typeof(extraFields)) !== undefined ? messages[rule].replace(/{form}|{value}/g, function (match) {
            return mapValue[match];
          }) : messages[rule].replace('{form}', formName);
        };

        _this.formatMessage = function (index, message) {
          var form = _this.state.form;

          var newMessage = (0, _reactAddonsUpdate2.default)(form[index], { message: { $set: message } });
          var newState = (0, _reactAddonsUpdate2.default)(form, { $splice: [[index, 1, newMessage]] });

          _this.setState(_extends({}, _this.state, { form: newState }), function () {
            _this.formIsValid();
          });
        };

        _this.getErrorMessage = function (key) {
          var form = _this.state.form;

          if ((0, _filter2.default)(form, function (f) {
            return f.name === key;
          }).length > 0) {
            return (0, _filter2.default)(form, function (f) {
              return f.name === key;
            })[0].message;
          }

          _this.formErrorLogger(key);
          return '';
        };

        _this.getErrorMessages = function () {
          var form = _this.state.form;

          return (0, _filter2.default)(form, function (f) {
            return !_validator2.default.isEmpty(f.message);
          });
        };

        _this.formIsValid = function () {
          var _this$state2 = _this.state,
              form = _this$state2.form,
              required = _this$state2.required;

          var errCount = (0, _filter2.default)(form, function (f) {
            return f.message !== '';
          }).length;
          var complete = (0, _filter2.default)((0, _keys2.default)(required), function (formIndex) {
            return required[formIndex] === '';
          }).length;

          if (errCount === 0 && complete === 0) {
            _this.setState(_extends({}, _this.state, { formIsValid: true }));
          } else {
            _this.setState(_extends({}, _this.state, { formIsValid: false }));
          }
        };

        _this.state = {
          form: validatorState,
          messages: validatorMsg,
          required: requiredForm,
          formIsValid: false
        };
        return _this;
      }

      /* Error log */


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
          return _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
            validate: this.validate,
            getErrorMessage: this.getErrorMessage,
            getErrorMessages: this.getErrorMessages,
            formIsValid: this.state.formIsValid
          }));
        }
      }]);

      return Validator;
    }(_react.Component), _class.displayName = 'Validator(' + ComposedComponent.name + ')', _temp;
  };

  return composed;
};

exports.default = withValidator;