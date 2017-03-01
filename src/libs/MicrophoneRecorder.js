let analyser;
let audioCtx;
let mediaRecorder;
let recordedBlobs = [];
let startTime;

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

export class MicrophoneRecorder {
  constructor() {
    return this;
  }

  startRecording=(actx, anal) => {
    const self = this;

    audioCtx = actx;
    analyser = anal;
    startTime = Date.now();

    if(audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if(mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      return;
    }

    if (navigator.getUserMedia) {
     console.log('getUserMedia supported.');

     navigator.getUserMedia (
          { audio: true  }, // constraints - only audio needed for this app

          // Success callback
          function(stream) {
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            mediaRecorder = new MediaRecorder(stream);
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

  handleDataAvailable= (event) => {
    if (event.data && event.data.size > 0) {
      console.log('the data is: ', event.data);
      recordedBlobs.push(event.data);
    }
  }

  stopRecording() {
   stopRecording();
  }

}

function stopRecording() {
  if(mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.pause();
    audioCtx.suspend();
    recordedBlobs = [];
    // mediaRecorder = undefined;
  }
}

export function saveRecording() {
    const blob = new Blob(recordedBlobs, {type: 'audio/webm'});
    const theBlobURL = window.URL.createObjectURL(blob);
    const blobObject = {
      blob      : blob,
      startTime : startTime,
      stopTime  : Date.now(),
      blobURL   : theBlobURL
    }

    stopRecording();
    return blobObject;
  }