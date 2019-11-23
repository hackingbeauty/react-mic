# React-Mic

Record a user's voice and display as an oscillation.

Plug-n-play component for React apps.

Audio is saved as [WebM](https://en.wikipedia.org/wiki/WebM) audio file format.  Works via the HTML5 MediaRecorder API ([currently only available in Chrome & Firefox](https://caniuse.com/#search=MediaRecorder)).

**PLEASE NOTE**: The WebM audio format is not supported in Safari browsers (including Safari on iOS).  You need to save an audio recording as a WAV file in order to get full cross-browser and cross-device support.

# React-Mic-Plus

If you need a version of this React component that supports the WAV audio format so that you can record audio recordings in *any* browser and mobile device (iOS + Android), you can purchase [React-Mic-Plus](https://react-mic-plus.professionalreactapp.com).

The goal: develop one codebase, and deploy apps that can record audio to *any* device.  One codebase, every device.  The beauty of building for the Web.

React-Mic-Plus also comes with an optional pause feature and additional [premium enhancements](https://react-mic-plus.professionalreactapp.com).

# React-Sound-Display

If you need to play back audio with a super cool visualization, you can do that with [React-Sound-Display](https://react-sound-display.professionalreactapp.com).  With React-Sound-Display you can play back audio and synchronize it with awesome visualizations that will impress your users.  You can choose to display audio as either oscillations or frequency bars (your choice).

See a demo of React-Sound-Display in action [here](https://voicerecordpro.com/#/users/EskpUSvOc0TArFJhXveCvSUDyr92/recordings/5f2c9cc0-0e3b-11ea-9e25-a3ac66642b09) (using frequency bars visualization).

# Get Support

Join the [Slack channel](https://hackingbeauty-slack-invite.herokuapp.com) if you have any questions or problems with React-Mic, React-Mic-Plus, or React-Sound-Display.  I'm here to help you build amazing apps with audio recording capabilities.

Customers of React-Mic-Plus and associated products frequently develop voice-activate apps, speech recognition apps, language learning apps, and much more.

# React Training Program

Register your seat for the FREE training workshop on [how to develop and design professional React apps](https://training.professionalreactapp.com/workshop) for an employer, clients, or your own startup.


## Demos

Check out the [demo](https://www.voicerecordpro.com/#/record).

## Installation

`npm install --save react-mic`

## Features

- Record audio from microphone
- Display sound wave as voice is being recorded
- Save audio as BLOB

## Usage

```js

<ReactMic
  record={boolean}         // defaults -> false.  Set to true to begin recording
  pause={boolean}          // defaults -> false.  Available in React-Mic-Plus upgrade only
  className={string}       // provide css class name
  onStop={function}        // callback to execute when audio stops recording
  onData={function}        // callback to execute when chunk of audio data is available
  strokeColor={string}     // sound wave color
  backgroundColor={string} // background color
/>

```

## Example

```js
import { ReactMic } from 'react-mic';

export class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    }

  }

  startRecording = () => {
    this.setState({
      record: true
    });
  }

  stopRecording = () => {
    this.setState({
      record: false
    });
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
  }

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />
        <button onTouchTap={this.startRecording} type="button">Start</button>
        <button onTouchTap={this.stopRecording} type="button">Stop</button>
      </div>
    );
  }
}
```

## License

MIT
