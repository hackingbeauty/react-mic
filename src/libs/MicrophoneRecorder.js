import AudioContext from './AudioContext';

let analyser;
let audioCtx;
let mediaRecorder;
let chunks = [];
let startTime;
let stream;
let mediaOptions;
let blobObject;
let onStopCallback;

const constraints = { audio: true, video: false }; // constraints - only audio needed

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

export class MicrophoneRecorder {
  constructor(callback, options) {
    onStopCallback = callback;
    mediaOptions = options;
  }

  startRecording=() => {

    if(mediaRecorder) {
      startTime = Date.now();

      if(audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if(mediaRecorder && mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
        return;
      }

      if(mediaRecorder && mediaRecorder.state === 'inactive') {
        mediaRecorder.start(10);
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
      }
    } else {
      if (navigator.mediaDevices) {
        console.log('getUserMedia supported.');

        navigator.mediaDevices.getUserMedia(constraints).then((str) => {
          stream = str;

          mediaRecorder = new MediaRecorder(str, mediaOptions);
          mediaRecorder.onstop = this.onStop;
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          }

          audioCtx = AudioContext.getAudioContext();
          analyser = AudioContext.getAnalyser();

          mediaRecorder.start(10);

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

        });
      } else {
        alert('Your browser does not support audio recording');
      }
    }

  }

  stopRecording() {
    if(mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      audioCtx.suspend();
    }
  }

  onStop(evt) {
    const blob = new Blob(chunks, { 'type' : 'audio/webm' });
    chunks = [];

    const blobObject =  {
      blob      : blob,
      startTime : startTime,
      stopTime  : Date.now(),
      options   : mediaOptions,
      blobURL   : window.URL.createObjectURL(blob)
    }

    onStopCallback(blobObject);

  }

}