# react-mic

Record a user's voice and display as an osscilation.

## Demo

Check out the [demo](https://hackingbeauty.github.io/react-mic/)

You can also see this component in action at [voicerecordpro.com](https://www.voicerecordpro.com)

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
  strokeColor={string}     // sound wave color
  backgroundColor={string} // background color
/>

```

## Example

```js
import ReactMic from 'react-mic';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    }
  }

  startRecording= () => {
    this.setState({
      record: true
    });
  }

  stopRecording= () => {
    this.setState({
      record: false
    });
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
  }

  render() {
    return (
      <ReactMic
        record={this.state.record}
        className="sound-wave"
        onStop={this.onStop}
        strokeColor="#000000"
        backgroundColor="#FF4081" />
      <button onTouchTap={this.startRecording} type="button">Start</button>
      <button onTouchTap={this.stopRecording} type="button">Stop</button>
    );
  }
}
```

## License

MIT
