// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

import React, { Component }   from 'react'
import { string, number, bool, func } from 'prop-types';
import { MicrophoneRecorder } from '../libs/MicrophoneRecorder';
import AudioContext           from '../libs/AudioContext';
import AudioPlayer            from '../libs/AudioPlayer';
import Visualizer             from '../libs/Visualizer';


export default class ReactMic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      microphoneRecorder  : null,
      canvas              : null,
      canvasCtx           : null
    }
  }

  componentDidMount() {
    const {
      onSave,
      onStop,
      onStart,
      onData,
      audioElem,
      audioBitsPerSecond,
      mimeType
    } = this.props;
    const { visualizer } = this.refs;
    const canvas = visualizer;
    const canvasCtx = canvas.getContext("2d");
    const options = {
      audioBitsPerSecond : audioBitsPerSecond,
      mimeType           : mimeType
    }

    if(audioElem) {
      AudioPlayer.create(audioElem);

      this.setState({
        canvas: canvas,
        canvasCtx: canvasCtx
      }, () => {
        this.visualize();
      });
    } else {

      this.setState({
        microphoneRecorder: new MicrophoneRecorder(
                              onStart,
                              onStop,
                              onSave,
                              onData,
                              options
                            ),
        canvas: canvas,
        canvasCtx: canvasCtx
      }, () => {
        this.visualize();
      });
    }

  }

  visualize = () => {
    const self = this;
    const { backgroundColor, strokeColor, width, height, visualSetting } = this.props;
    const { canvas, canvasCtx } = this.state;

    if(visualSetting === 'sinewave') {
      Visualizer.visualizeSineWave(canvasCtx, canvas, width, height, backgroundColor, strokeColor);
    } else if(visualSetting === 'frequencyBars') {
      Visualizer.visualizeFrequencyBars(canvasCtx, canvas, width, height, backgroundColor, strokeColor);
    } else if(visualSetting === 'frequencyCircles') {
      Visualizer.visualizeFrequencyCircles(canvasCtx, canvas, width, height, backgroundColor, strokeColor);
    }

  }

  clear() {
    const { width, height } = this.props;
    const { canvasCtx  } = this.state;
    canvasCtx.clearRect(0, 0, width, height);
  }

  render() {
    const { record, onStop, width, height } = this.props;
    const { microphoneRecorder, canvasCtx } = this.state;

    if(record) {
      if(microphoneRecorder) {
        microphoneRecorder.startRecording();

      }
    } else {
      if (microphoneRecorder) {
        microphoneRecorder.stopRecording(onStop);
        this.clear();
      }
    }

    return (<canvas ref="visualizer" height={height} width={width} className={this.props.className}></canvas>);
  }
}

ReactMic.propTypes = {
  backgroundColor : string,
  strokeColor     : string,
  className       : string,
  audioBitsPerSecond: number,
  mimeType        : string,
  height          : number,
  record          : bool.isRequired,
  onStop          : func,
  onData          : func
};

ReactMic.defaultProps = {
  backgroundColor   : 'rgba(255, 255, 255, 0.5)',
  strokeColor       : '#000000',
  className         : 'visualizer',
  audioBitsPerSecond: 128000,
  mimeType          : 'audio/webm;codecs=opus',
  record            : false,
  width             : 640,
  height            : 100,
  visualSetting     : 'sinewave'
}
