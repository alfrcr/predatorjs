import React from 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './App'

const Container = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
)

injectTapEventPlugin()
const mountPoint = document.getElementById('root')

render(<Container />, mountPoint)
