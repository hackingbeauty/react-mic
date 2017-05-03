import AudioContext from './AudioContext';

let analyser;
let audioCtx;
let mediaRecorder;
let chunks = [];
let startTime;
let stream;
let blobObject;
let onStopCallback;

const constraints = { audio: true, video: false }; // constraints - only audio needed

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

export class MicrophoneRecorder {
  constructor(callback) {
    if (navigator.mediaDevices) {
     console.log('getUserMedia supported.');

      navigator.mediaDevices.getUserMedia(constraints).then((str) => {
        stream = str;
        mediaRecorder = new MediaRecorder(str);
        mediaRecorder.onstop = this.onStop;
        onStopCallback = callback;
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        }
      });
    } else {
      alert('Your browser does not support audio recording');
    }
    return this;
  }

  startRecording=() => {
    audioCtx = AudioContext.getAudioContext();
    analyser = AudioContext.getAnalyser();

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
      blobURL   : window.URL.createObjectURL(blob)
    }

    onStopCallback(blobObject);

  }

}