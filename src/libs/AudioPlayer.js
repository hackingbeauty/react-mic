import AudioContext from './AudioContext';

const AudioPlayer =  {

  create(audioElem) {
    const audioCtx = AudioContext.getAudioContext();
    const analyser = AudioContext.getAnalyser();
    const source = audioCtx.createMediaElementSource(audioElem);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

}

export default AudioPlayer;