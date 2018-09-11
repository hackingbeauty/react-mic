import AudioContext from './AudioContext';
import AudioRecorder from './AudioRecorder';

let analyser;
let audioCtx;
let mediaRecorder;
let chunks = [];
let startTime;
let stream;
let mediaOptions;
let blobObject;
let onStartCallback;
let onStopCallback;
let onSaveCallback;
let onDataCallback;
let recorder

const constraints = { audio: true, video: false }; // constraints - only audio needed

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

export class MicrophoneRecorder {
  constructor(onStart, onStop, onSave, onData, options) {
    onStartCallback= onStart;
    onStopCallback= onStop;
    onSaveCallback = onSave;
    onDataCallback = onData;
    mediaOptions= options;
  }

  startRecording=() => {
    if (navigator.mediaDevices) {
      console.log('getUserMedia supported.');

      navigator.mediaDevices.getUserMedia(constraints)
        .then((str) => {
          stream = str;

          if(onStartCallback) { onStartCallback() };

          recorder = new AudioRecorder(str, mediaOptions)
          recorder.start()

        });

    } else {
      alert('Your browser does not support audio recording');
    }
  }

  stopRecording() {
    if(recorder) {
      const blobObject = recorder.exportWav()

      recorder.stop();
      recorder = null

      if(onStopCallback) { onStopCallback(blobObject) };
      if(onSaveCallback) { onSaveCallback(blobObject) };
    }
  }


}
