import React from 'react';

export class CalcInput extends React.Component {
  render() {
    return (
      <input onChange={this.props.onChange} value={this.props.value} />
    );
  }
}
