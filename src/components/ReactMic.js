// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

import React, { Component } from 'react'
import { MicrophoneRecorder } from '../libs/MicrophoneRecorder';
import AudioContext from '../libs/AudioContext';

export default class ReactMic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioCtx: null,
      analyser: null,
      microphoneRecorder: null,
      visualizerCanvas: null,
      visualizerCanvasCtx: null
    }
  }

  componentDidMount() {
    const { onStop } = this.props;
    const { visualizer } = this.refs;
    const analyser = AudioContext.getAnalyser();
    const visualizerCanvas = visualizer;
    const visualizerCanvasCtx = visualizer.getContext("2d");

    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 2048;

    this.setState({
      analyser: analyser,
      microphoneRecorder: new MicrophoneRecorder(onStop),
      visualizerCanvas: visualizerCanvas,
      visualizerCanvasCtx: visualizerCanvasCtx
    }, () => {
      this.visualize();
    });


  }

  visualize= () => {
    const { backgroundColor, strokeColor, width, height } = this.props;
    const { visualizerCanvas, visualizerCanvasCtx, analyser } = this.state;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    visualizerCanvasCtx.fillStyle = backgroundColor;
    visualizerCanvasCtx.strokeStyle = strokeColor;
    visualizerCanvasCtx.lineWidth = 3;

    function draw() {
      const drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      visualizerCanvasCtx.fillRect(0, 0, width, height);
      visualizerCanvasCtx.beginPath();

      var sliceWidth = width * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * height/2;

        if(i === 0) {
          visualizerCanvasCtx.moveTo(x, y);
        } else {
          visualizerCanvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      visualizerCanvasCtx.lineTo(visualizerCanvas.width, visualizerCanvas.height/2);
      visualizerCanvasCtx.stroke();
    };

    draw();
  }

  clear() {
    const { visualizerCanvasCtx, width, height } = this.state;
    visualizerCanvasCtx.clearRect(0, 0, width, height);
    visualizerCanvasCtx.moveTo(0, 0);
    visualizerCanvasCtx.lineTo(0, 0);
    visualizerCanvasCtx.closePath();
  }

  render() {
    const { record, onStop, width, height } = this.props;
    const { analyser, audioCtx, microphoneRecorder, visualizerCanvasCtx } = this.state;

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

    return (
      <canvas ref="visualizer" className={this.props.className}></canvas>
    );
  }
}

ReactMic.propTypes = {
  backgroundColor : React.PropTypes.string,
  strokeColor     : React.PropTypes.string,
  className       : React.PropTypes.string,
  height          : React.PropTypes.number,
  record          : React.PropTypes.bool.isRequired,
  onStop          : React.PropTypes.func
};

ReactMic.defaultProps = {
  backgroundColor : '#4bb8d1',
  strokeColor     : '#000000',
  className       : 'visualizer',
  record          : false,
  width           : 640,
  height          : 100
}