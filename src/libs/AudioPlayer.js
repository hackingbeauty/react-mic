import AudioContext from './AudioContext';

let audioSource;

const AudioPlayer =  {

  create(audioElem) {
    const audioCtx = AudioContext.getAudioContext();
    const analyser = AudioContext.getAnalyser();

    if(audioSource === undefined){
      const source = audioCtx.createMediaElementSource(audioElem);
      source.connect(analyser);
      audioSource = source;
    }

    analyser.connect(audioCtx.destination);
  }

}

export default AudioPlayer;