import React, {Component}          from 'react';
import { render }                  from 'react-dom';
import { FloatingActionButton,
        MuiThemeProvider }         from 'material-ui';
import MicrophoneOn                from 'material-ui/svg-icons/av/mic';
import MicrophoneOff               from 'material-ui/svg-icons/av/stop';
import PauseIcon                   from 'material-ui/svg-icons/av/pause';

import { ReactMic }                from '../../src';
import sampleAudio                 from './sample_audio.webm';
import ReactGA                     from 'react-ga';

require ('./styles.scss');

ReactGA.initialize('UA-98862819-1');

export default class Demo extends Component {
  constructor(props){
    super(props);
    this.state = {
      blobObject: null,
      isRecording: false,
      isPaused: false
    }
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }

  startOrPauseRecording= () => {
    const { isPaused, isRecording } = this.state

    if(isPaused) {
      this.setState({ isPaused: false })
    } else if(isRecording) {
      this.setState({ isPaused: true })
    } else {
      this.setState({ isRecording: true })
    }
  }

  stopRecording= () => {
    this.setState({ isRecording: false });
  }

  onSave=(blobObject) => {
  }

  onStart=() => {
    console.log('You can tap into the onStart callback');
  }

  onStop= (blobObject) => {
    this.setState({ blobURL : blobObject.blobURL });
  }

  onData(recordedBlob){
    console.log('ONDATA CALL IS BEING CALLED! ', recordedBlob);
  }

  onBlock() {
    alert('ya blocked me!')
  }

  onPause() {
    alert('ya paused it')
  }

  render() {
    const { blobURL, isRecording, isPaused } = this.state;

    return(
      <MuiThemeProvider>
        <div>
          <h1>React-Mic-Plus</h1>
          <p><a href="https://github.com/hackingbeauty/react-mic">Documentation</a></p>
          <ReactMic
            className="oscilloscope"
            record={isRecording}
            pause={isPaused}
            backgroundColor="#FF4081"
            visualSetting="sinewave"
            audioBitsPerSecond= {128000}
            onStop={this.onStop}
            onStart={this.onStart}
            onSave={this.onSave}
            onData={this.onData}
            onBlock={this.onBlock} //Only available in React-Mic-Plus
            onPause={this.onPause} //Only available in React-Mic-Plus
            strokeColor="#000000" />
          <div>
            <audio ref="audioSource" controls="controls" src={blobURL}></audio>
          </div>
          <br />
          <br />
          <FloatingActionButton
            className="btn"
            secondary={true}
            onClick={this.startOrPauseRecording}>
            { (isRecording && !isPaused )? <PauseIcon /> : <MicrophoneOn /> }
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
          <p>As featured in the course <br /><a href="http://professionalreactapp.com">How To Develop A Professional React App</a></p>
          <br />
          <br />
          <p>Check out how I use it in my app
          <br />
            <a href="http://voicerecordpro.com" target="_blank">Voice Record Pro</a> (record your voice and publish it)</p>
        </div>
    </MuiThemeProvider>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
