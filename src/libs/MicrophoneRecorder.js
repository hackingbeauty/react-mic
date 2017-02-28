let mediaRecorder;
let recordedBlobs = [];
let source;

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

export default class MicrophoneRecorder {

  startRecording=(audioCtx, analyser) => {
    const self = this;
    if(mediaRecorder && mediaRecorder.state === 'recording') {
      return;
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
            mediaRecorder = new MediaRecorder(stream);
            //set up the different audio nodes we will use for the app
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const mediaURL = window.URL.createObjectURL(stream);

            mediaRecorder.ondataavailable = self.handleDataAvailable;
            mediaRecorder.start(10);
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

  handleDataAvailable= () => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  stopRecording(analyser, audioCtx) {

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
}