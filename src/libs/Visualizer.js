let drawVisual;

const Visualizer = {

  visualizeSineWave(analyser, canvasCtx, canvas, width, height, backgroundColor, strokeColor) {
    analyser.fftSize = 2048;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    function draw() {

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, width, height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = strokeColor;

      canvasCtx.beginPath();

      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height/2;

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
  },

  visualizeFrequencyBars(analyser, canvasCtx, canvas, width, height, backgroundColor, strokeColor) {
    const self = this;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const rgb = self.hexToRgb(strokeColor);

        // canvasCtx.fillStyle = `rgb(${barHeight+100},${rgb.g},${rgb.b})`;
        canvasCtx.fillStyle = strokeColor;
        canvasCtx.fillRect(x,height-barHeight/2,barWidth,barHeight/2);

        x += barWidth + 1;
      }
    };

    draw();
  },

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

}

export default Visualizer;