import React                    from 'react'
import {render}                 from 'react-dom'
import { FloatingActionButton,
        MuiThemeProvider }      from 'material-ui';
import injectTapEventPlugin    from 'react-tap-event-plugin';
import MicrophoneOff            from 'material-ui/svg-icons/av/mic';
import MicrophoneOn             from 'material-ui/svg-icons/av/stop';

import Component from '../../src'

injectTapEventPlugin();

let Demo = React.createClass({
  render() {
    return <MuiThemeProvider>
      <div>
        <Component
          backgroundColor="#FF4081"
          strokeColor="#000000" />
        <FloatingActionButton
          secondary={true}
          onTouchTap={toggleMicrophone}>
          <MicrophoneOff />
        </FloatingActionButton>
      </div>
    </MuiThemeProvider>
  }
})

function toggleMicrophone(){
  
}

render(<Demo/>, document.querySelector('#demo'))
