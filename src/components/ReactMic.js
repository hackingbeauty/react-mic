// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

import React, { Component } from 'react'
import { MicrophoneRecorder } from '../libs/MicrophoneRecorder';
import AudioContext from '../libs/AudioContext';

let stream;
let visualizerCanvas;
let visualizerCanvasCtx;
let microphoneRecorder;
let blobURL;
let recordedBlobs = [];
let blobObject;
let startTime;

const WIDTH="640";
const HEIGHT ="100";

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
    const self = this;
    const audioCtxObj = new AudioContext();
    const audioCtx = audioCtxObj.create();
    const analyser = audioCtx.createAnalyser();
    const visualizerCanvas = this.refs.visualizer;
    const visualizerCanvasCtx = this.refs.visualizer.getContext("2d");

    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 2048;

    this.setState({
      audioCtx: audioCtx,
      analyser: analyser,
      microphoneRecorder: new MicrophoneRecorder(),
      visualizerCanvas: visualizerCanvas,
      visualizerCanvasCtx: visualizerCanvasCtx
    });

    this.visualize(analyser, visualizerCanvas, visualizerCanvasCtx);
  }

  visualize= (analyser, visualizerCanvas, visualizerCanvasCtx) => {
    const self = this;
    const { backgroundColor, strokeColor } = this.props;

    var bufferLength = analyser.fftSize;

    var dataArray = new Uint8Array(bufferLength);

    visualizerCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {

      const drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      visualizerCanvasCtx.fillStyle = backgroundColor;
      visualizerCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      visualizerCanvasCtx.lineWidth = 3;
      visualizerCanvasCtx.strokeStyle = strokeColor;

      visualizerCanvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

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

  render() {
    const { record } = this.props;
    const { analyser, audioCtx, microphoneRecorder } = this.state;

    if(record) {
      if(microphoneRecorder) {
        microphoneRecorder.startRecording(audioCtx, analyser);
      }
    } else {
      if (microphoneRecorder) {
        microphoneRecorder.stopRecording(analyser, audioCtx);
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
  record          : React.PropTypes.bool.isRequired
};

ReactMic.defaultProps = {
  backgroundColor : '#4bb8d1',
  strokeColor     : '#000000',
  className       : 'visualizer'
}