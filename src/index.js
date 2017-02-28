// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

import React, { Component } from 'react'
import MicrophoneRecorder from './libs/MicrophoneRecorder';
import AudioContext from './libs/AudioContext';


let stream;
let visualizerCanvas;
let visualizerCanvasCtx;
let mediaRecorder;
let blobURL;
let recordedBlobs = [];
let blobObject;
let startTime;

const WIDTH="640";
const HEIGHT ="100";

export class ReactMic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioCtx: null,
      analyser: null,
      mediaRecorder: null,
      visualizerCanvas: null,
      visualizerCanvasCtx: null
    }
  }

  componentDidMount() {
    const self = this;
    const audioCtxObj = new AudioContext();
    const audioCtx = audioCtxObj.create();
    const analyser = audioCtx.createAnalyser();

    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 2048;

    const visualizerCanvas = this.refs.visualizer;
    const visualizerCanvasCtx = this.refs.visualizer.getContext("2d");

    this.setState({
      audioCtx: audioCtx,
      analyser: analyser,
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

  // startRecording= () => {
  //   const { mediaRecorder, audioCtx } = this.state;

  //   mediaRecorder.startRecording();

  //   if(audioCtx.state === 'suspended') {
  //     audioCtx.resume();
  //   }

  // }

  startRecorder = (mediaURL, stream) => {
    const { mediaRecorder, audioCtx, analyser } = this.state;

    let options = { mimeType: 'audio/webm' };

    if(mediaRecorder) {
      mediaRecorder.resume();
    } else {
      const mediaRecorder = new MicrophoneRecorder();
      mediaRecorder.startRecording(audioCtx, analyser);
    }

    startTime = Date.now();
  }

  render() {
    const { record } = this.props;
    const { analyser, audioCtx, mediaRecorder } = this.state;

    if(record) {
      this.startRecorder();
    } else {
      if (mediaRecorder) {
        mediaRecorder.stopRecording(analyser, audioCtx);
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

export function saveRecording() {
  let theBlobURL;

  if(blobURL) {
    theBlobURL = blobURL;
  } else {
    const blob = new Blob(recordedBlobs, {type: 'audio/webm'});
    theBlobURL = window.URL.createObjectURL(blob);
    blobObject = {
      blob      : blob,
      startTime : startTime,
      stopTime  : Date.now(),
      blobURL   : theBlobURL
    }
    blobURL = theBlobURL;
  }
  this.stopRecording();
  return blobObject;
}
