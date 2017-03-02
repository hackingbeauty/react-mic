let analyser;
let audioCtx;
let mediaRecorder;
let recordedBlobs = [];
let startTime;
let stream;

const constraints = { audio: true, video: false }; // constraints - only audio needed

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

export class MicrophoneRecorder {
  constructor() {
    const self = this;

    if (navigator.mediaDevices) {
     console.log('getUserMedia supported.');

      navigator.mediaDevices.getUserMedia(constraints).then((str) => {
        stream = str;
        mediaRecorder = new MediaRecorder(str);
        mediaRecorder.onstop = this.onStop;
        mediaRecorder.ondataavailable = this.handleDataAvailable;
      });
    }
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

    // if(mediaRecorder && mediaRecorder.state === 'paused') {
    //   mediaRecorder.resume();
    //   return;
    // }

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    mediaRecorder.start(10);
  }

  handleDataAvailable= (event) => {
    recordedBlobs.push(event.data);
  }

  onStop() {
    console.log('======= stopping this! =======');
    var blob = new Blob(recordedBlobs, { 'type' : 'audio/ogg; codecs=opus' });
    var audioURL = window.URL.createObjectURL(blob);
    console.log(audioURL);


    var audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    audio.controls = true;
    audio.src = audioURL;
    document.body.appendChild(audio);

    recordedBlobs = [];
  }

  stopRecording() {
    if(mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      audioCtx.suspend();
      recordedBlobs = [];
    }
  }

}

export function saveRecording() {
    // console.log('recordedBlobs', recordedBlobs);
    // const blob = new Blob(recordedBlobs, { 'type' : 'audio/ogg; codecs=opus' });
    // const blobObject = {
    //   blob      : blob,
    //   startTime : startTime,
    //   stopTime  : Date.now(),
    //   blobURL   : window.URL.createObjectURL(blob)
    // }
    // return blobObject;
  }