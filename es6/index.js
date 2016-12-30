// Inspired by react-redux's `connect()` HOC factory function implementation:

import map from 'lodash/map'
import keys from 'lodash/keys'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import findIndex from 'lodash/findIndex'

import React, { Component } from 'react'
import update from 'react-addons-update'
import invariant from 'invariant'
import titleCase from 'title-case'
import validator from 'validator'
import hoistStatics from 'hoist-non-react-statics'

function mapRules(rules) {
  invariant(
    rules, `
    PredatorJS: Form rules should be string divided by |.
    For example: required|alphanumeric|min:6|max:12
  `)

  return map(rules.split('|'), rule => {
    if (rule.indexOf('min:') !== -1 || rule.indexOf('max:') !== -1) {
      const minMax = rule.split(':')
      return assign({}, { type: minMax[0], [minMax[0]]: minMax[1] })
    }

    return assign({}, { type: rule })
  })
}

const defaultMessages = {
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
}

export default function withValidator(rules, messages) {
  const createFormState = map(keys(rules), form => ({
    name: form,
    message: '',
    value: '',
    rules: mapRules(rules[form])
  }))

  const createMessageState = (typeof messages !== 'undefined')
    ? assign({}, defaultMessages, messages)
    : assign({}, defaultMessages)

  return function wrapWithValidator(WrappedComponent) {
    invariant(
      typeof WrappedComponent === 'function',
      'You must pass a component to the function returned by withValidator.'
    )

    const getDisplayName = name => `Validator(${name})`

    const wrappedComponentName = WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'

    const displayName = getDisplayName(wrappedComponentName)

    class Validator extends Component {
      constructor(props) {
        super(props)
        this.state = {
          form: createFormState,
          formMessages: createMessageState,
          formIsValid: false
        }
      }

      onInitValidate = selector => {
        const form = document.querySelectorAll(`${selector} input:not(button):not(hidden):not(file)`)
        const event = new Event('input', { bubbles: true })

        forEach(form, f => setTimeout(() => f.dispatchEvent(event), 10))
      };

      /* Get error message by key */
      getErrorMessage = key => {
        const { form } = this.state
        const errFound = filter(form, f => f.name === key).length > 0
        return errFound ? filter(form, f => f.name === key)[0].message : ''
      };

      /* Get all messages with form name and rules */
      getErrorMessages = () => {
        const { form } = this.state
        return filter(form, f => !validator.isEmpty(f.message))
          .map(f => ({
            name: f.name,
            message: f.message
          }))
      };

      validate = (key, value) => {
        const { form } = this.state
        const index = findIndex(form, data => data.name === key)
        const newForm = update(form[index], { value: { $set: value } })
        const newState = update(form, { $splice: [[index, 1, newForm]] })

        this.setState({ ...this.state, form: newState }, () => {
          this.validating(index)
        })
      };

      validating = index => {
        const form = this.state.form[index]

        /* Make sure value is String */
        const value = form.value + ''
        const formName = titleCase(form.name)
        const resetMessage = this.formatMessage(index, '')

        forEach(form.rules, rule => {
          switch (rule.type) {
            case 'required':
              return validator.isEmpty(value)
                ? this.formatMessage(index, this.buildMessage('required', formName))
                : resetMessage
            case 'email':
              return value && !validator.isEmail(value)
                ? this.formatMessage(index, this.buildMessage('email', formName))
                : resetMessage
            case 'url':
              return value && !validator.isURL(value)
                ? this.formatMessage(index, this.buildMessage('url', formName))
                : resetMessage
            case 'ip':
              return value && !validator.isIP(value)
                ? this.formatMessage(index, this.buildMessage('ip', formName))
                : resetMessage
            case 'date':
              return value && !validator.isDate(value)
                ? this.formatMessage(index, this.buildMessage('date', formName))
                : resetMessage
            case 'bool':
              return value && !validator.isBoolean(value)
                ? this.formatMessage(index, this.buildMessage('bool', formName))
                : resetMessage
            case 'alpha':
              return value && !validator.isAlpha(value)
                ? this.formatMessage(index, this.buildMessage('alpha', formName))
                : resetMessage
            case 'num':
              return value && !validator.isNumeric(value)
                ? this.formatMessage(index, this.buildMessage('num', formName))
                : resetMessage
            case 'alphanumeric':
              return value && !validator.isAlphanumeric(value)
                ? this.formatMessage(index, this.buildMessage('alphanumeric', formName))
                : resetMessage
            case 'min':
              return value && value.length < rule.min
                ? this.formatMessage(index, this.buildMessage('min', formName, rule.min))
                : resetMessage
            case 'max':
              return value && value.length > rule.max
                ? this.formatMessage(index, this.buildMessage('max', formName, rule.max))
                : resetMessage
            default:
              return resetMessage
          }
        })
      };

      buildMessage = (rule, formName, extraFields) => {
        const { formMessages } = this.state
        const mapValue = {
          '{form}': formName,
          '{value}': extraFields
        }

        return (typeof extraFields !== 'undefined')
          ? formMessages[rule].replace(/{form}|{value}/g, match => mapValue[match])
          : formMessages[rule].replace('{form}', formName)
      };

      formatMessage = (index, message) => {
        const { form } = this.state
        const newMessage = update(form[index], { message: { $set: message } })
        const newState = update(form, { $splice: [[index, 1, newMessage]] })

        this.setState({ ...this.state, form: newState }, () => {
          this.formIsValid()
        })
      };

      /*
       *  Validate form
       *  The purpose of this method is
       *  to disable or enable submit button
       */
      formIsValid = () => {
        const { form } = this.state
        const errCount = filter(form, f => f.message !== '').length
        const required = filter(form, f => filter(f.rules, r => r.type === 'required').length > 0)
        const uncomplete = filter(required, r => r.value === '').length

        this.setState({ ...this.state, formIsValid: (errCount === 0 && uncomplete === 0) })
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            onInitValidate={this.onInitValidate}
            validate={this.validate}
            getErrorMessage={this.getErrorMessage}
            getErrorMessages={this.getErrorMessages}
            formIsValid={this.state.formIsValid}
          />
        )
      }
    }

    Validator.WrappedComponent = WrappedComponent
    Validator.displayName = displayName

    return hoistStatics(Validator, WrappedComponent)
  }
}
