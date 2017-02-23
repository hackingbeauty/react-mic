// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

import React, { Component } from 'react'

const mediaConstraints = {
  audio: true
};

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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

//set up the different audio nodes we will use for the app

const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
analyser.fftSize = 2048;


// const distortion = audioCtx.createWaveShaper();
// const gainNode = audioCtx.createGain();
// const biquadFilter = audioCtx.createBiquadFilter();
// const convolver = audioCtx.createConvolver();

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

export class ReactMic extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const self = this;

    visualizerCanvas = this.refs.visualizer;
    visualizerCanvasCtx = this.refs.visualizer.getContext("2d");

    visualize(this.props);
  }

  render() {
    return (
      <canvas ref="visualizer" className={this.props.className}></canvas>
    );
  }
}


export function startRecording() {
  const self = this;

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
          source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          // analyser.connect(distortion);
          // distortion.connect(biquadFilter);
          // biquadFilter.connect(convolver);
          // convolver.connect(gainNode);
          // gainNode.connect(audioCtx.destination);
          // startMSRRecorder(stream);
          const mediaURL = window.URL.createObjectURL(stream);
          startRecorder(mediaURL,stream);
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

function stopRecording() {
  if(mediaRecorder && mediaRecorder.state !== 'inactive') {

    mediaRecorder.pause();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 2048;

    audioCtx.suspend();

    recordedBlobs.length = 0;
    blobURL = undefined;
  }
}

function pauseRecording(){
  mediaRecorder.pause();
  audioCtx.suspend();
}

function startRecorder(mediaURL,stream) {
  let options = {mimeType: 'audio/webm'};

  // debugger;

  if(mediaRecorder) {
    mediaRecorder.resume();
  } else {
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
  }

  startTime = Date.now();
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

function getBlobURL() {
  return blobURL;
}

function handleDataAvailable() {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }

}

function visualize(props) {
  const self = this;

  var bufferLength = analyser.fftSize;

  var dataArray = new Uint8Array(bufferLength);

  visualizerCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  function draw() {

    const drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    visualizerCanvasCtx.fillStyle = props.backgroundColor;
    visualizerCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    visualizerCanvasCtx.lineWidth = 3;
    visualizerCanvasCtx.strokeStyle = props.strokeColor;

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



ReactMic.propTypes = {
  backgroundColor : React.PropTypes.string,
  strokeColor     : React.PropTypes.string,
  className       : React.PropTypes.string,
  height          : React.PropTypes.number
};

ReactMic.defaultProps = {
  backgroundColor : '#4bb8d1',
  strokeColor     : '#000000',
  className       : 'visualizer'
}