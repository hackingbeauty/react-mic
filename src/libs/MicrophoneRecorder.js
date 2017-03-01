let analyser;
let audioCtx;
let mediaRecorder;
let recordedBlobs = [];
let source;
let startTime;
let blobURL;

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

    if(mediaRecorder && mediaRecorder.state === 'recording') {
      return;
    }

    if (navigator.getUserMedia) {
     console.log('getUserMedia supported.');

     navigator.getUserMedia (
          { audio: true  }, // constraints - only audio needed for this app

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

  stopRecording() {
   stopRecording();
  }

}

function stopRecording() {
 if(mediaRecorder && mediaRecorder.state !== 'inactive') {

      mediaRecorder.stop();
      audioCtx.suspend();

      recordedBlobs.length = 0;
      blobURL = undefined;
      source = undefined;
      mediaRecorder = undefined;
    }
}

export function saveRecording() {
    let theBlobURL, blobObject;

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