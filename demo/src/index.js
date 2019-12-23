import React, { Component } from 'react'
import { render } from 'react-dom'
import ReactGA from 'react-ga'
import AudioRecorder from './components/AudioRecorder'

ReactGA.initialize('UA-98862819-1')

require('./normalize.scss')
require('./styles/font-awesome/css/all.min.css')
require('./styles.scss')

export default class Demo extends Component {
  render() {
    return (
      <div>
        <AudioRecorder/>
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
