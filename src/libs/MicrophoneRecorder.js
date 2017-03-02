let analyser;
let audioCtx;
let mediaRecorder;
let chunks = [];
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
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        }
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

    if(mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      return;
    }

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    mediaRecorder.start(10);
  }

  stopRecording() {
    if(mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      audioCtx.suspend();
    }
  }

  onStop() {
    console.log('======= stopping this! =======');
    var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    chunks = [];
    var audioURL = window.URL.createObjectURL(blob);
    console.log(audioURL);


    var audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    audio.controls = true;
    audio.src = audioURL;
    document.body.appendChild(audio);

    console.log('yahooooo')
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