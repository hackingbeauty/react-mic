/* Reference this: https://gist.github.com/meziantou/edb7217fddfbb70e899e */

import AudioContext from './AudioContext';

let recordingLength= 0 // why can you not put this in constructor?
let leftchannel = [];
let rightchannel = [];
let sampleRate
let startTime
let mediaOptions
let recorder
let audioInput

export default class AudioRecorder {
  constructor(stream) {
    this.stream = stream
    this.audioCtx = AudioContext.getAudioContext();
    this.analyser = AudioContext.getAnalyser();
    mediaOptions = mediaOptions
  }

  start() {
    const { audioCtx, analyser } = this
    const volume = audioCtx.createGain()
    audioInput = audioCtx.createMediaStreamSource(this.stream);

    sampleRate = audioCtx.sampleRate

    if(audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    audioInput.connect(volume)

    const bufferSize = 2048;
    recorder = audioCtx.createScriptProcessor(bufferSize, 2, 2);

    recorder.onaudioprocess = function(e){
      console.log ('recording');

      const left = e.inputBuffer.getChannelData (0);
      const right = e.inputBuffer.getChannelData (1);

      // // we clone the samples
      leftchannel.push (new Float32Array (left));
      rightchannel.push (new Float32Array (right));
      recordingLength += bufferSize;
    }

    volume.connect(recorder)
    audioInput.connect(analyser);
    recorder.connect(analyser);
    startTime = Date.now();
  }

  stop() {
    const { stream, audioCtx } = this

    recordingLength= 0
    leftchannel = [];
    rightchannel = [];

    stream.getAudioTracks().forEach((track) => {
      track.stop()
    })

    recorder.disconnect(this.audioCtx)
    audioCtx.suspend();
  }


  mergeBuffers(channelBuffer, recordingLength){
    var result = new Float32Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++){
      var buffer = channelBuffer[i];
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  }

  interleave(leftChannel, rightChannel){
    const length = leftChannel.length + rightChannel.length;
    const result = new Float32Array(length);

    let inputIndex = 0;

    for (var index = 0; index < length; ){
      result[index++] = leftChannel[inputIndex];
      result[index++] = rightChannel[inputIndex];
      inputIndex++;
    }
    return result;
  }

  writeUTFBytes(view, offset, string){
    var lng = string.length;
    for (var i = 0; i < lng; i++){
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  exportWav() {
    // we flat the left and right channels down
    var leftBuffer = this.mergeBuffers( leftchannel, recordingLength );
    var rightBuffer = this.mergeBuffers( rightchannel, recordingLength );
    // we interleave both channels together
    var interleaved = this.interleave( leftBuffer, rightBuffer );

    // create the buffer and view to create the .WAV file
    var buffer = new ArrayBuffer(44 + interleaved.length * 2);
    var view = new DataView(buffer);

    // write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
    // RIFF chunk descriptor
    this.writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + interleaved.length * 2, true);
    this.writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    this.writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    this.writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // write the PCM samples
    var lng = interleaved.length;
    var index = 44;
    var volume = 1;
    for (var i = 0; i < lng; i++){
        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
    }

    // our final binary blob that we can hand off
    var blob = new Blob ( [ view ], { type : 'audio/wav' } );

    const blobObject =  {
      blob      : blob,
      startTime : startTime,
      stopTime  : Date.now(),
      options   : mediaOptions,
      blobURL   : window.URL.createObjectURL(blob)
    }

    return blobObject
  }

}
