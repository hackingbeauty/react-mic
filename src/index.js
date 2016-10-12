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

export default class ReactMic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visualizerCanvas     : null,
      visualizerCanvasCtx  : null,
      mediaRecorder        : false
    }
  }

   componentDidMount() {
    const self = this;

    this.setState({
      visualizerCanvas : self.refs.visualizer,
      visualizerCanvasCtx : self.refs.visualizer.getContext("2d")
    }, () => {
      this.visualize();
    });
  }

  makeDistortionCurve(amount) {
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

  startRecording() {
    const self = this;

    this.startRecorder();

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

  stopRecording() {
    if(this.state.mediaRecorder) {
      this.state.mediaRecorder.stop();
      this.state.mediaRecorder.save()
    }
  }

  startRecorder() {
    const self = this;

    if (navigator.getUserMedia) {
      navigator.getUserMedia(mediaConstraints, (stream) => {
        const mediaRecorder = new MediaStreamRecorder(stream);
        self.setState({
          mediaRecorder: mediaRecorder
        }, () => {
          mediaRecorder.mimeType = 'audio/wav';
          mediaRecorder.start(6000);
        });

      }, () => {
        alert('Media error!');
      });
    } else {
      alert('Media capture not supported in your browser. Please get the latest version of Chrome');
    }
  }

  visualize() {
    const self = this;

      analyser.fftSize = 2048;
      var bufferLength = analyser.fftSize;

      var dataArray = new Uint8Array(bufferLength);

      this.state.visualizerCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      function draw() {

        const drawVisual = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        self.state.visualizerCanvasCtx.fillStyle = self.props.backgroundColor;
        self.state.visualizerCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        self.state.visualizerCanvasCtx.lineWidth = 2;
        self.state.visualizerCanvasCtx.strokeStyle = self.props.strokeColor;

        self.state.visualizerCanvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;

          if(i === 0) {
            self.state.visualizerCanvasCtx.moveTo(x, y);
          } else {
            self.state.visualizerCanvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        self.state.visualizerCanvasCtx.lineTo(self.state.visualizerCanvas.width, self.state.visualizerCanvas.height/2);
        self.state.visualizerCanvasCtx.stroke();
      };

      draw();
  }

  render() {
    return (
      <div className="visualizer-container">
        <canvas ref="visualizer" height="100" className={this.props.className}></canvas>
      </div>
    );
  }
}

ReactMic.propTypes = {
  backgroundColor : React.PropTypes.string,
  className       : React.PropTypes.string
};

ReactMic.defaultProps = {
  backgroundColor : '4bb8d1',
  className : 'visualizer'
}

