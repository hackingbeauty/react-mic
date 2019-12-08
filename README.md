# React-Mic
 
Record a user's voice and display as an oscillation (or frequency bars).

Plug-n-play component for React apps.

Audio is saved as [WebM](https://en.wikipedia.org/wiki/WebM) audio file format.  Works via the HTML5 MediaRecorder API ([currently only available in Chrome & Firefox](https://caniuse.com/#search=MediaRecorder)).

**PLEASE NOTE**: The WebM audio format is not supported in Safari browsers (including Safari on iOS).  You need to save an audio recording as a WAV file in order to get full cross-browser and cross-device support.

You can do that with the premium enhancement of this component called [React-Mic-Plus](https://react-mic-plus.professionalreactapp.com/sales-page23901658).

Companies that develop speech-recognition apps, voice-activated software, apps that require audio recording features, or language-learning products all use React-Mic-Plus.


## Installation

`npm install --save react-mic`

`yarn add react-mic`

## Demos

Check out the simple React-Mic [demo](https://hackingbeauty.github.io/react-mic/).

## Features

- Record audio from microphone
- Display sound wave as voice is being recorded
- Save audio as BLOB

## License

MIT

## Usage

```js

<ReactMic
  record={boolean}         // defaults -> false.  Set to true to begin recording
  pause={boolean}          // defaults -> false.  Available in React-Mic-Plus upgrade only
  visualSetting="sinewave" // defaults -> "sinewave".  Other option is "frequencyBars"
  className={string}       // provide css class name
  onStop={function}        // called when audio stops recording
  onData={function}        // called when chunk of audio data is available
  onBlock={function}       // called if user selected "block" when prompted to allow microphone access.
  //onBlock is available in React-Mic-Plus upgrade only.
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

# React-Mic-Plus

![Voice Record Pro](https://professionalreactapp.com/assets/images/voice-record-pro-iphone-encased-small.png)

If you need a version of this React component that supports the WAV audio format so that you can record audio in *any* browser and mobile device (iOS + Android), you can purchase [React-Mic-Plus](https://react-mic-plus.professionalreactapp.com).

The goal: develop one codebase and deploy an app that can record audio on *any* device.  One codebase, every device.  The beauty of building for the Web.

React-Mic-Plus also comes with an optional pause feature and additional [premium enhancements](https://react-mic-plus.professionalreactapp.com).

[Demo](https://voicerecordpro.com/#/record) of React-Mic-Plus in action (using oscillation visualization).

Existing customers, please access the latest code updates from the private member's area [here](https://hackingbeautyllc.clickfunnels.com/react-mic-plus-members-area).

**PLEASE NOTE**: Apple does not allow audio recording from the Chrome browser on Iphone/iOS.  To record audio from a web application on an Iphone, a user must use the Safari browser.  There is no way around this.

&nbsp;
&nbsp;

# React-Sound-Display

![React-Sound-Display snapshot](https://professionalreactapp.com/assets/images/thumbnails/thumb-playback-view-2.png)

If you need to play back audio with a super cool visualization, you can do that with [React-Sound-Display](https://react-sound-display.professionalreactapp.com).

With React-Sound-Display you can play back audio and synchronize it with awesome visualizations that will impress your users.  You can choose to display audio as either oscillations or frequency bars (your choice).

[Demo](https://voicerecordpro.com/#/users/EskpUSvOc0TArFJhXveCvSUDyr92/test-recordings/5f2c9cc0-0e3b-11ea-9e25-a3ac66642b09) of React-Sound-Display (using oscillation visualization).

[Demo](https://voicerecordpro.com/#/users/EskpUSvOc0TArFJhXveCvSUDyr92/recordings/5f2c9cc0-0e3b-11ea-9e25-a3ac66642b09) of React-Sound-Display (using frequency bars visualization).

&nbsp;
&nbsp;

# Get Support

Join the [Slack channel](https://hackingbeauty-slack-invite.herokuapp.com) if you have any questions or problems with React-Mic, React-Mic-Plus, or React-Sound-Display.  I'm here to help you build amazing apps with audio recording capabilities.

Customers of React-Mic-Plus and associated products frequently develop voice-activated apps, speech recognition apps, language learning apps, and much more.

&nbsp;
&nbsp;

# Voice Record Pro App Template

Begin development of your audio-recording, speech-recognition, or language-learning app with an expert React codebase and basic features created by professional Front-End Engineers.  And save a *ton* of development time and headaches.

Leare more about the app template [here](https://hackingbeautyllc.clickfunnels.com/sales-pagewlku31vk).

Purchase of the expert template includes a video course which shows you how to install, configure, deploy, and change the UI theme of the template easily.

![Voice Record Pro App Template](https://images.clickfunnels.com/cc/3d9378f44f4aaf8ff31dcdeb136c7e/big-browser-voice-record-pro.png)

&nbsp;
&nbsp;

# React Training

Get the skills to become a 6 figure Front-End Engineer, and register your seat for the FREE training workshop ["How To Develop Professional React Apps"](https://professionalreactapp.com).

Learn how to develop high qualty apps using the insanely popular React.js for clients, employers, or your own startup.

&nbsp;
&nbsp;

![React.js high salary](https://professionalreactapp.com/assets/images/react-salary.png)
