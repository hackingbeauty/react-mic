export default class MicrophoneRecorder {
  create(stream, options) {
    const mediaRecorder = new MediaRecorder(stream, options);
    return mediaRecorder;
  }
}