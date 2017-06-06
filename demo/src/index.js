import React, {Component}          from 'react';
import { render }                  from 'react-dom';
import { FloatingActionButton,
        MuiThemeProvider }         from 'material-ui';
import injectTapEventPlugin        from 'react-tap-event-plugin';
import MicrophoneOn                from 'material-ui/svg-icons/av/mic';
import MicrophoneOff               from 'material-ui/svg-icons/av/stop';

import { ReactMic, saveRecording } from '../../src';
import sampleAudio                 from './sample_audio.webm';
import ReactGA                     from 'react-ga';

require ('./styles.scss');

injectTapEventPlugin();

ReactGA.initialize('UA-98862819-1');

export default class Demo extends Component {
  constructor(props){
    super(props);
    this.state = {
      record: false,
      blobObject: null,
      isRecording: false
    }
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }

  startRecording= () => {
    this.setState({
      record: true,
      isRecording: true
    });
  }

  stopRecording= () => {
    this.setState({
      record: false,
      isRecording: false
    });
  }

  onStop= (blobObject) => {
    this.setState({
      blobURL : blobObject.blobURL
    })
  }

  render() {
    const { isRecording } = this.state;

    return(
      <MuiThemeProvider>
        <div>
          <h1>React-Mic</h1>
          <p><a href="https://github.com/hackingbeauty/react-mic">Documentation</a></p>
          <ReactMic
            className="oscilloscope"
            record={this.state.record}
            backgroundColor="#FF4081"
            visualSetting="sinewave"
            onStop={this.onStop}
            strokeColor="#000000" />
          <div>
            <audio ref="audioSource" controls="controls" src={this.state.blobURL}></audio>
          </div>
          <br />
          <br />
          <FloatingActionButton
            className="btn"
            secondary={true}
            disabled={isRecording}
            onClick={this.startRecording}>
            <MicrophoneOn />
          </FloatingActionButton>
          <FloatingActionButton
            className="btn"
            secondary={true}
            disabled={!isRecording}
            onClick={this.stopRecording}>
            <MicrophoneOff />
          </FloatingActionButton>
          <br />
          <br />
          <br />
          <p>As featured in the course <br /><a href="http://singlepageapplication.com">How to Write a Single Page Application</a></p>
        </div>
    </MuiThemeProvider>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
