import React, { Component } from 'react'
import MediaStreamRecorder  from 'msr';

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
const voiceSelect = document.getElementById("voice");
let source;
let stream;
let visualizerCanvas;
let visualizerCanvasCtx;
let mediaRecorder;

const WIDTH="640";
const HEIGHT ="100";

//set up the different audio nodes we will use for the app

const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

const distortion = audioCtx.createWaveShaper();
const gainNode = audioCtx.createGain();
const biquadFilter = audioCtx.createBiquadFilter();
const convolver = audioCtx.createConvolver();

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

class ReactMic extends Component {
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
      <div className="visualizer-container">
        <canvas ref="visualizer" height={this.props.height} className={this.props.className}></canvas>
      </div>
    );
  }
}

export default {
  ReactMic       : ReactMic,
  startRecording : startRecording,
  stopRecording  : stopRecording,
  pauseRecording : pauseRecording
}

function startRecording() {
  const self = this;

  if(audioCtx.state === 'suspended') {
    audioCtx.resume();
  } else {
    startRecorder();

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
            analyser.connect(distortion);
            distortion.connect(biquadFilter);
            biquadFilter.connect(convolver);
            convolver.connect(gainNode);
            gainNode.connect(audioCtx.destination);
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
}

function stopRecording(externalBlob, fileName = 'Untitled') {
  mediaRecorder.stop();
  audioCtx.suspend();
}

function pauseRecording(){
  mediaRecorder.pause();
  audioCtx.suspend();
}

function saveRecording(externalBlob, fileName = 'Untitled') {
  if(externalBlob) {
    mediaRecorder.save(externalBlob, fileName);
  } else {
    mediaRecorder.save();
  }
}

function startRecorder() {
  const self = this;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(mediaConstraints, (stream) => {
      mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.mimeType = 'audio/webm';
      mediaRecorder.start(1000);

    }, () => {
      alert('Media error!');
    });
  } else {
    alert('Media capture not supported in your browser. Please get the latest version of Chrome');
  }
}

function visualize(props) {
  const self = this;

  analyser.fftSize = 2048;
  var bufferLength = analyser.fftSize;

  var dataArray = new Uint8Array(bufferLength);

  visualizerCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  function draw() {

    const drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    visualizerCanvasCtx.fillStyle = props.backgroundColor;
    visualizerCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    visualizerCanvasCtx.lineWidth = 2;
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

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

ReactMic.propTypes = {
  backgroundColor : React.PropTypes.string,
  strokeColor     : React.PropTypes.string,
  className       : React.PropTypes.string,
  height          : React.PropTypes.number
};

ReactMic.defaultProps = {
  backgroundColor : '#4bb8d1',
  strokeColor     : '#000000',
  className       : 'visualizer',
  height          : 100
}