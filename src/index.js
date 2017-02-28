// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

import React, { Component } from 'react'
import MicrophoneRecorder from './libs/MicrophoneRecorder';
import AudioContext from './libs/AudioContext';

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes

let source;
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
      mediaRecorder: null
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

    this.setState({
      audioCtx: audioCtx,
      analyser: analyser
    });

    visualizerCanvas = this.refs.visualizer;
    visualizerCanvasCtx = this.refs.visualizer.getContext("2d");
    this.visualize(analyser, visualizerCanvasCtx);
  }

  visualize= (analyser, visualizerCanvasCtx) => {
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

  startRecording= () => {
    const self = this;

    const { audioCtx, analyser, mediaRecorder } = this.state;

    if(mediaRecorder && mediaRecorder.state === 'recording') {
      return;
    }

    if(audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (navigator.getUserMedia) {
     console.log('getUserMedia supported.');
     navigator.getUserMedia (
        // constraints - only audio needed for this app
          {
             audio: true
          },

          // Success callback
          function(stream) {
            //set up the different audio nodes we will use for the app

            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const mediaURL = window.URL.createObjectURL(stream);
            self.startRecorder(mediaURL, stream);
          },

          // Error callback
          function(err) {
             console.log('The following gUM error occured: ' + err);
          }
       );
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }

  stopRecording=() => {
    const { analyser, audioCtx } = this.state;

    if(mediaRecorder && mediaRecorder.state !== 'inactive') {

      mediaRecorder.stop();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
      analyser.fftSize = 2048;

      audioCtx.suspend();

      recordedBlobs.length = 0;
      blobURL = undefined;
      source = undefined;
      mediaRecorder = undefined;
    }
  }

  startRecorder = (mediaURL, stream) => {
    const { mediaRecorder } = this.state;

    let options = { mimeType: 'audio/webm' };

    if(mediaRecorder) {
      mediaRecorder.resume();
    } else {
      const mediaRecorderObj = new MicrophoneRecorder();
      const mediaRecorder = mediaRecorderObj.create(stream, options)
      mediaRecorder.ondataavailable = this.handleDataAvailable;
      mediaRecorder.start(10);
    }

    startTime = Date.now();
  }

  handleDataAvailable= () => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  render() {
    const { record } = this.props;

    if(record) {
      this.startRecording();
    } else {
      this.stopRecording();
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
  stopRecording();
  return blobObject;
}
