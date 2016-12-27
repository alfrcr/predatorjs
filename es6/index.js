/* eslint-disable prefer-template, no-console */

import map from 'lodash/map'
import keys from 'lodash/keys'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import findIndex from 'lodash/findIndex'

import React, { Component } from 'react'
import update from 'react-addons-update'
import titleCase from 'title-case'
import validator from 'validator'

const withValidator = (rules, messages) => {
  const validatorState = map(keys(rules), form => ({
    name: form,
    message: '',
    rules: map(rules[form].split('|'), rule => {
      if (rule.indexOf('min:') !== -1 || rule.indexOf('max:') !== -1) {
        const minMax = rule.split(':')
        return assign({}, { type: minMax[0], [minMax[0]]: minMax[1] })
      }

      return assign({}, { type: rule })
    })
  }))

  const requiredForm = filter(keys(rules), form => rules[form].indexOf('required') !== -1)
    .reduce((current, next) => {
      current[next] = ''
      return current
    }, {})

  const defaultMsg = {
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
  }

  const validatorMsg = (typeof messages !== undefined)
    ? assign({}, defaultMsg, messages)
    : assign({}, defaultMsg)

  const composed = ComposedComponent =>
    class Validator extends Component {
      static displayName = `Validator(${ComposedComponent.name})`

      constructor(props) {
        super(props)

        this.state = {
          form: validatorState,
          messages: validatorMsg,
          required: requiredForm,
          formIsValid: false
        }
      }

      /* Error log */
      formErrorLogger = key => {
        console.error(`Redator Error: ${key} never been registered to the form rules.`)
      };

      validate = (key, value) => {
        const { form, required } = this.state
        const index = findIndex(form, data => data.name === key)
        const newState = update(required, { [key]: { $set: value } })

        if (key in this.state.required) {
          this.setState({ ...this.state, required: newState }, () => {
            this.validating(form[index].rules, index, value)
          })
        } else {
          this.validating(form[index].rules, index, value)
        }

      };

      validating = (formRules, index, formValue) => {
        const { form } = this.state

        /* Make sure value is String */
        const value = formValue + ''

        const formName = titleCase(form[index].name)
        const resetMessage = this.formatMessage(index, '')

        /* Iterate attached form rules */
        forEach(formRules, rule => {
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
        const { messages } = this.state
        const mapValue = {
          '{form}': formName,
          '{value}': extraFields
        }

        return (typeof extraFields !== undefined)
          ? messages[rule].replace(/{form}|{value}/g, match => mapValue[match])
          : messages[rule].replace('{form}', formName)
      }

      formatMessage = (index, message) => {
        const { form } = this.state
        const newMessage = update(form[index], { message: { $set: message } })
        const newState = update(form, { $splice: [[index, 1, newMessage]] })

        this.setState({ ...this.state, form: newState }, () => {
          this.formIsValid()
        })
      };

      /* Get error message by key */
      getErrorMessage = key => {
        const { form } = this.state
        if (filter(form, f => f.name === key).length > 0) {
          return filter(form, f => f.name === key)[0].message
        }

        this.formErrorLogger(key)
        return ''
      };

      /* Get all messages with form name and rules */
      getErrorMessages = () => {
        const { form } = this.state
        return filter(form, f => !validator.isEmpty(f.message))
      };

      /*
       *  Validate form
       *  The purpose of this method is
       *  to disable or enable submit button
       */
      formIsValid = () => {
        const { form, required } = this.state
        const errCount = filter(form, f => f.message !== '').length
        const complete = filter(keys(required), formIndex => required[formIndex] === '').length

        if (errCount === 0 && complete === 0) {
          this.setState({ ...this.state, formIsValid: true })
        } else {
          this.setState({ ...this.state, formIsValid: false })
        }
      };

      render() {
        return (
          <ComposedComponent
            {...this.props}
            validate={this.validate}
            getErrorMessage={this.getErrorMessage}
            getErrorMessages={this.getErrorMessages}
            formIsValid={this.state.formIsValid}
          />
        )
      }
    }

  return composed
}

export default withValidator
