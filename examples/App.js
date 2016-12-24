/* eslint-disable react/jsx-boolean-value */

import React, { Component, PropTypes } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import withValidator from '../es6/index'

class ExampleForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        username: '',
        fullname: '',
        email: '',
        gender: '',
        phone: '',
        address: ''
      }
    }
  }

  handleChange = (key, value) => {
    this.setState({ form: { ...this.state.form, [key]: value } })
  };

  handleSubmit = e => {
    e.preventDefault()
    console.log(this.state.form) // eslint-disable-line no-console
  };

  render() {
    const {
      validate,
      getErrorMessage,
      formIsValid
    } = this.props

    const { form } = this.state

    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <div style={{ maxWidth: 450, margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'Helvetica' }}>Predator Example</h3>
          <div>
            <TextField
              hintText="Username"
              floatingLabelText="Username"
              fullWidth={true}
              value={form.username}
              onChange={({ target }) => {
                validate('username', target.value)
                this.handleChange('username', target.value)
              }}
              errorText={getErrorMessage('username')}
            />
          </div>
          <div>
            <TextField
              name="fullname"
              hintText="Full Name"
              floatingLabelText="Full Name"
              fullWidth={true}
              value={form.fullname}
              onChange={({ target }) => {
                validate('fullname', target.value)
                this.handleChange('fullname', target.value)
              }}
              errorText={getErrorMessage('fullname')}
            />
          </div>
          <div>
            <TextField
              name="email"
              hintText="Email"
              floatingLabelText="Email"
              fullWidth={true}
              value={form.email}
              onChange={({ target }) => {
                validate('email', target.value)
                this.handleChange('email', target.value)
              }}
              errorText={getErrorMessage('email')}
            />
          </div>
          <div>
            <TextField
              name="phone"
              hintText="Phone"
              floatingLabelText="Phone"
              fullWidth={true}
              value={form.phone}
              onChange={({ target }) => {
                validate('phone', target.value)
                this.handleChange('phone', target.value)
              }}
              errorText={getErrorMessage('phone')}
            />
          </div>
          <div>
            <RaisedButton
              type="submit"
              label="Save"
              primary={true}
              disabled={!formIsValid}
            />
          </div>
        </div>
      </form>
    )
  }
}

ExampleForm.propTypes = {
  validate: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  formIsValid: PropTypes.bool.isRequired
}

const formRules = {
  username: 'required|min:6|max:12',
  fullname: 'required',
  email: 'required|email',
  phone: 'num'
}

const formMessages = {
  required: 'Telolet! {form} can not be empty!',
  email: 'This {form} is not a valid email!',
  num: '{form} only accept number.'
}

export default withValidator(formRules, formMessages)(ExampleForm)
