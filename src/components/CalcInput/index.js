import React from 'react';

export class CalcInput extends React.Component {
  render() {
    return (
      <input
        onChange={(ev, value) => this.props.onChange(ev.target.value)}
        value={this.props.value}
      />
    );
  }
}
