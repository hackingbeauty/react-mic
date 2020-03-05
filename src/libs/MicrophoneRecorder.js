import AudioContext from './AudioContext'

let analyser
let audioCtx
let mediaRecorder
let chunks = []
let startTime
let stream
let mediaOptions
let onStartCallback
let onStopCallback
let onSaveCallback
let onDataCallback
let constraints

navigator.getUserMedia = (navigator.getUserMedia
                          || navigator.webkitGetUserMedia
                          || navigator.mozGetUserMedia
                          || navigator.msGetUserMedia)

export class MicrophoneRecorder {
  constructor(onStart, onStop, onSave, onData, options, soundOptions) {
    const {
      echoCancellation,
      autoGainControl,
      noiseSuppression,
      channelCount
    } = soundOptions

    onStartCallback = onStart
    onStopCallback = onStop
    onSaveCallback = onSave
    onDataCallback = onData
    mediaOptions = options

    constraints = {
      audio: {
        echoCancellation,
        autoGainControl,
        noiseSuppression,
        channelCount
      },
      video: false
    }
  }

  startRecording=() => {
    startTime = Date.now()

    if (mediaRecorder) {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume()
      }

      if (mediaRecorder && mediaRecorder.state === 'paused') {
        mediaRecorder.resume()
        return
      }

      if (audioCtx && mediaRecorder && mediaRecorder.state === 'inactive') {
        mediaRecorder.start(10)
        const source = audioCtx.createMediaStreamSource(stream)
        source.connect(analyser)
        if (onStartCallback) { onStartCallback() }
      }
    } else if (navigator.mediaDevices) {
      console.log('getUserMedia supported.')

      navigator.mediaDevices.getUserMedia(constraints)
        .then((str) => {
          stream = str

          if (MediaRecorder.isTypeSupported(mediaOptions.mimeType)) {
            mediaRecorder = new MediaRecorder(str, mediaOptions)
          } else {
            mediaRecorder = new MediaRecorder(str)
          }

          if (onStartCallback) { onStartCallback() }

          mediaRecorder.onstop = this.onStop
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data)
            if (onDataCallback) {
              onDataCallback(event.data)
            }
          }

          audioCtx = AudioContext.getAudioContext()
          audioCtx.resume().then(() => {
            analyser = AudioContext.getAnalyser()
            mediaRecorder.start(10)
            const sourceNode = audioCtx.createMediaStreamSource(stream)
            sourceNode.connect(analyser)
          })
        })
    } else {
      alert('Your browser does not support audio recording')
    }
  }

  stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()

      stream.getAudioTracks().forEach((track) => {
        track.stop()
      })
      mediaRecorder = null
      AudioContext.resetAnalyser()
    }
  }

  onStop() {
    const blob = new Blob(chunks, { type: mediaOptions.mimeType })
    chunks = []

    const blobObject = {
      blob,
      startTime,
      stopTime: Date.now(),
      options: mediaOptions,
      blobURL: window.URL.createObjectURL(blob)
    }

    if (onStopCallback) { onStopCallback(blobObject) }
    if (onSaveCallback) { onSaveCallback(blobObject) }
  }
}
