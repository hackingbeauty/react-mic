import React, { Component } from 'react'

export default class ReactMic extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return <div>hi</div>
  }
}

ReactMic.propTypes = {
  backgroundColor : React.PropTypes.string
};

ReactMic.defaultProps = {
  backgroundColor : '4bb8d1'
}

