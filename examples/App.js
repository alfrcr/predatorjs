/* eslint-disable react/jsx-boolean-value */

import React, { Component, PropTypes } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import withValidator from '../lib'

class ExampleForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        username: 'alfrcr',
        fullname: '',
        email: 'alfredcrozby@gmail',
        phone: '08980780780',
        address: 'Jln. Sumbangsih V. Karet Kuningan, Setiabudi. Jakarta Selatan'
      }
    }
  }

  componentDidMount() {
    /* Trigger onChange on all input form */
    this.props.onInitValidate('#predator-form')
  }

  handleChange = (key, value) => {
    this.setState({ form: { ...this.state.form, [key]: value } }, () =>
      this.props.validate(key, value)
    )
  };

  handleSubmit = e => {
    e.preventDefault()
    console.log(this.state.form) // eslint-disable-line no-console
  };

  render() {
    const {
      getErrorMessage,
      getErrorMessages,
      formIsValid
    } = this.props

    const { form } = this.state

    const errors = getErrorMessages()
    const messagesList = errors.map((m, i) =>
      <li key={i}>{m.name}: {m.message}</li>
    )

    return (
      <form id="predator-form" onSubmit={e => this.handleSubmit(e)}>
        <div style={{ maxWidth: 450, margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'Helvetica' }}>Predator Example</h3>
          {errors.length > 0 &&
            <ul>{messagesList}</ul>
          }
          <div>
            <TextField
              hintText="Username"
              floatingLabelText="Username"
              fullWidth={true}
              value={form.username}
              onChange={({ target }) => this.handleChange('username', target.value)}
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
              onChange={({ target }) => this.handleChange('fullname', target.value)}
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
              onChange={({ target }) => this.handleChange('email', target.value)}
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
              onChange={({ target }) => this.handleChange('phone', target.value)}
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
  getErrorMessages: PropTypes.func.isRequired,
  onInitValidate: PropTypes.func.isRequired,
  formIsValid: PropTypes.bool.isRequired
}

const formRules = {
  username: 'required|alphanumeric|min:8|max:15',
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
