# Painless React Form Validator

Predator is a React Higher Order Component to validate form with basic validator.
Predator is inspired by [Laravel Validation](https://laravel.com/docs/5.3/validation)

## Examples 

This example is using [Material-UI](https://material-ui.com)
But don't worry Predator works with any form

```javascript
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import withValidator from 'predatorjs'

class ExampleForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ... }
  }

  handleChange = (key, value) => { ... };

  handleSubmit = e => { ... };

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

          ... // other components

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

/*
 * formRules is required
*/
const formRules = {
  username: 'required|min:6|max:12',
  fullname: 'required',
  email: 'required|email',
  phone: 'num'
}

/*
 *  Form messages is optional
 *  Automaticaly use default messages
 *  if formMessages is not provided
*/
const formMessages = {
    required: 'Telolet! {form} can not be empty!',
    email: 'This {form} is not a valid email!',
    num: '{form} only accept number.'
  }

export default withValidator(formRules, formMessages)(ExampleForm)

```

## Available Rules

These are available rules for a while.
Feel free to add another rule by submitting PR

| Rules         | Description           |
| ------------- |:---------------------:|
| `required`    | Form can not be empty |
| `email`       | Validating Email      |
| `url`         | Validating URL        |
| `bool`        | Validating Bool       |
| `ip`          | Validating IP         |
| `date`        | Validating Date       |
| `alpha`       | Only accept alphabet  |
| `number`      | Only accept number    |
| `min`         | Minimal character     |
| `max`         | Maximal character     |

## Todo

1. Add another advance rules
2. Add test case

## License

MIT