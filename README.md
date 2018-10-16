# react-mic

Record a user's voice and display as an oscillation.  Audio is saved as [WebM](https://en.wikipedia.org/wiki/WebM) audio file format.

**PLEASE NOTE**: The WebM audio format is not supported in Safari browsers (including Safari on iOS).  You need to save an audio recording as a WAV file  in order to get full cross-browser and cross-device support.

If you need a version of this React component with added WAV support so you can record and play back audio recordings in *any* browser and mobile device (iOS + Android), please [purchase React-Mic-Plus](https://hackingbeautyllc.clickfunnels.com/sales-page23901658).  You can [join this Slack channel](https://publicslack.com/slacks/hackingbeauty/invites/new) if you have any questions or problems.

Featured in the course ["How To Develop A Professional React App"](http://professionalreactapp.com).

Works via the HTML5 MediaRecorder API ([currently only available in Chrome & Firefox](https://caniuse.com/#search=MediaRecorder)).

## Demos

Check out the simple [demo](https://hackingbeauty.github.io/react-mic/) first.

Check out the component in action within a professional Web app [here](https://www.voicerecordpro.com/#/record).

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
# Having issues with the lambda function?
Try installing babel-preset-stage-1

Include stage-1 in your webpack.config under presets.

e.g.

```js
module.exports = {
    entry: "./scripts/Main.js",
    output: {
        path: __dirname,
        filename: "./static/script.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.js$/,
            // exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react', 'stage-1']
            }
        }]

    }
};
```

## License

MIT
