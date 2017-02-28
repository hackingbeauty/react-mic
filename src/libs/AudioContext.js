export default class AudioContext  {

  create() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

}