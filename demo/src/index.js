import React                    from 'react'
import {render}                 from 'react-dom'
import { FloatingActionButton,
        MuiThemeProvider }      from 'material-ui';
import injectTapEventPlugin    from 'react-tap-event-plugin';
import MicrophoneOff            from 'material-ui/svg-icons/av/mic';
import MicrophoneOn             from 'material-ui/svg-icons/av/stop';

import Component from '../../src'

injectTapEventPlugin();

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record : false
    }
  }

  toggleMicrophone() {
    alert('toggling')
  }

  getMicrophoneIcon() {
    if(this.state.record) {
      return(<MicrophoneOn />);
    } else {
      return(<MicrophoneOff />);
    }
  }

  render() {
    const microphone = this.getMicrophoneIcon();

    return <MuiThemeProvider>
      <div>
        <Component
          backgroundColor="#FF4081"
          strokeColor="#000000" />
        <FloatingActionButton
          secondary={true}
          onTouchTap={this.toggleMicrophone.bind(this)}>
          {microphone}
        </FloatingActionButton>
      </div>
    </MuiThemeProvider>
  }
}

render(<Demo/>, document.querySelector('#demo'))
