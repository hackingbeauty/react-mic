// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

import React, { Component } from 'react'
import { MicrophoneRecorder } from '../libs/MicrophoneRecorder';
import AudioContext from '../libs/AudioContext';
let drawVisual;

export default class ReactMic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analyser            : null,
      microphoneRecorder  : null,
      canvas              : null,
      canvasCtx           : null
    }
  }

  componentDidMount() {
    const { onStop, audioSource } = this.props;
    const { visualizer } = this.refs;
    const canvas = visualizer;
    const canvasCtx = canvas.getContext("2d");

    if(audioSource) {
      const analyser = AudioContext.getAnalyser();

      this.setState({
        analyser            : analyser,
        canvas              : canvas,
        canvasCtx           : canvasCtx
      }, () => {
        this.visualize();
      });
    } else {
      const analyser = AudioContext.getAnalyser();

      this.setState({
        analyser            : analyser,
        microphoneRecorder  : new MicrophoneRecorder(onStop),
        canvas              : canvas,
        canvasCtx           : canvasCtx
      }, () => {
        this.visualize();
      });
    }

  }

  visualize= () => {
    const self = this;
    const { backgroundColor, strokeColor, width, height, visualSetting } = this.props;
    const { canvas, canvasCtx, analyser } = this.state;

    if(visualSetting === 'sinewave') {
      analyser.fftSize = 2048;

      var bufferLength = analyser.fftSize;
      var dataArray = new Uint8Array(bufferLength);

      canvasCtx.clearRect(0, 0, width, height);

      function draw() {

        drawVisual = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, width, height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = strokeColor;

        canvasCtx.beginPath();

        var sliceWidth = width * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * height/2;

          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
      };

      draw();

    } else if(visualSetting === 'frequencyBars') {
      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      console.log(bufferLength);
      var dataArray = new Uint8Array(bufferLength);

      canvasCtx.clearRect(0, 0, width, height);

      function draw() {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, width, height);

        var barWidth = (width / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          const rgb = self.hexToRgb(strokeColor);

          // canvasCtx.fillStyle = `rgb(${barHeight+100},${rgb.g},${rgb.b})`;
          canvasCtx.fillStyle = strokeColor;
          canvasCtx.fillRect(x,height-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        }
      };

      draw();

    }

  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  clear() {
    const { canvasCtx, width, height } = this.state;
    canvasCtx.clearRect(0, 0, width, height);
  }


  render() {
    const { record, onStop, width, height } = this.props;
    const { analyser,  microphoneRecorder, canvasCtx } = this.state;

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
  backgroundColor : React.PropTypes.string,
  strokeColor     : React.PropTypes.string,
  className       : React.PropTypes.string,
  height          : React.PropTypes.number,
  record          : React.PropTypes.bool.isRequired,
  onStop          : React.PropTypes.func
};

ReactMic.defaultProps = {
  backgroundColor : 'rgba(255, 255, 255, 0.5)',
  strokeColor     : '#000000',
  className       : 'visualizer',
  record          : false,
  width           : 640,
  height          : 100,
  visualSetting   : 'sinewave'
}