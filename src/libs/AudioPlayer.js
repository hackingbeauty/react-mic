import AudioContext from './AudioContext';

const AudioPlayer =  {

  play(audioSource) {
    const audioElem = new Audio();
    audioElem.src = audioSource;
    audioElem.autoplay = true;
    audioElem.loop = false;
    const audioCtx = AudioContext.getAudioContext();
    const analyser = AudioContext.getAnalyser();
    const source = audioCtx.createMediaElementSource(audioElem);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

}

export default AudioPlayer;