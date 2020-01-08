# React-Mic
 
Record a user's voice and display as an oscillation (or frequency bars).

Plug-n-play component for React apps.

Audio is saved as [WebM](https://en.wikipedia.org/wiki/WebM) audio file format.  Works via the HTML5 MediaRecorder API ([currently only available in Chrome & Firefox](https://caniuse.com/#search=MediaRecorder)).

**PLEASE NOTE**: The WebM audio format is not supported in Safari browsers (including Safari on iOS).  You need to save an audio recording as an MP3 or WAV file in order to get full cross-browser and cross-device support.

You can do that with the premium enhancement of this component called [React-Mic-Gold](https://react-mic-gold.professionalreactapp.com/sales-page34701298).

Companies that develop speech-recognition apps, voice-activated software, apps that require audio recording features, or language-learning products use React-Mic-Gold.


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
  pause={boolean}          // defaults -> false.  Available in React-Mic-Gold/Plus upgrade only
  visualSetting="sinewave" // defaults -> "sinewave".  Other option is "frequencyBars"
  className={string}       // provide css class name
  onStop={function}        // required - called when audio stops recording
  onData={function}        // optional - called when chunk of audio data is available
  onBlock={function}       // optional - called if user selected "block" when prompted to allow microphone access...onBlock is available in React-Mic-Gold/Plus upgrade only.
  strokeColor={string}     // sinewave or frequency bar color
  backgroundColor={string} // background color
  mimeType="audio/mp3"     // defaults -> "audio/mp3".  Set to "audio/wav" for WAV audio format.  Available in React-Mic-Gold/Plus only.
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
    this.setState({ record: true });
  }

  stopRecording = () => {
    this.setState({ record: false });
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

# React-Mic-Gold

![Voice Record Pro](https://professionalreactapp.com/assets/images/react-mic-gold-voice-record-pro-iphone-encased-small.png)

Get your copy of React-Mic-Gold, the premium enhanced version of React-Mic [here](https://react-mic-gold.professionalreactapp.com/sales-page34701298).

[React-Mic-Gold](https://react-mic-gold.professionalreactapp.com/sales-page34701298) lets you record audio as either MP3 or WAV files.  The MP3 audio file format is super compressed which will result in small file sizes, and is widely supported across all devices.  The WAV audio file format is uncompressed and is used when you need professional quality audio; however, the file size is *significantly* larger.

## Demos

Check out the simple demo of React-Mic-Gold in action [here](https://hackingbeauty.github.io/react-mic-gold/).

Also, check out React-Mic-Gold integrated into an actual app [here](https://voicerecordpro.com/#/record).

## Details

In React-Mic-Gold, encoding of recorded audio into MP3 format happens in the browser, via a combination of advanced Web technologies (Web Workers and Web Assembly).

You won't have to continuously stream audio data to your back-end server or API endpoint to convert captured audio into an MP3 file.  Althought you can if you want to.

React-Mic-Gold also comes with an optional pause feature and additional [premium enhancements](https://react-mic-gold.professionalreactapp.com/sales-page34701298).

&nbsp;
&nbsp;

# React-Mic-Plus

![Voice Record Pro](https://professionalreactapp.com/assets/images/voice-record-pro-iphone-encased-small.png)

If you need a version of React-Mic that supports the WAV audio format only, so that you can record audio in *any* browser and mobile device (iOS + Android), you can purchase [React-Mic-Plus](https://react-mic-plus.professionalreactapp.com).


Note:  React-Mic-Plus only records audio in the WAV audio format.  If you need to save you audio files as MP3, then get your copy of [React-Mic-Gold](https://react-mic-gold.professionalreactapp.com/sales-page34701298).

**PLEASE NOTE**: Apple does not allow audio recording from the Chrome browser on Iphone/iOS.  To record audio from a web application on an Iphone, a user must use the Safari browser.  There is no way around this.


&nbsp;
&nbsp;

# Get Support

Join the [Slack channel](https://hackingbeauty-slack-invite.herokuapp.com) if you have any questions or problems with React-Mic, React-Mic-Plus, or React-Sound-Gold.  I'm here to help you build amazing apps with audio recording capabilities.

Customers of React-Mic-Gold, React-Mic-Plus, and associated products develop audio recording apps, voice-activated apps, speech recognition apps, language learning apps, and much more.

&nbsp;
&nbsp;

# Voice Record Pro App Template

Begin development of your audio-recording, speech-recognition, or language-learning app with an expert React codebase and basic features created by professional Front-End Engineers.  And save a *ton* of development time and headaches.

Leare more about the app template [here](https://hackingbeautyllc.clickfunnels.com/sales-pagewlku31vk).

Purchase of the expert template includes a video course which shows you how to install, configure, deploy, and change the UI theme of the template easily.

![Voice Record Pro App Template](https://images.clickfunnels.com/7e/c18561919d4387b238b64acaccedc6/New-Mockup-1.png)

&nbsp;
&nbsp;

# Professional React Training

Get the skills to become a 6 figure Front-End Engineer, and register your seat for the FREE training workshop ["How To Develop Professional React Apps"](https://professionalreactapp.com).

Learn how to develop high qualty apps using the insanely popular React.js for clients, employers, or your own startup.

&nbsp;
&nbsp;

![React.js high salary](https://professionalreactapp.com/assets/images/react-salary.png)
