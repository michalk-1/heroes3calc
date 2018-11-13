import React from 'react';

export class CalcResult extends React.Component {
  render() {
    return (
      <div>
        <p>
          Damage:{' '}
          <span>{this.props.min}</span>
          {' '}-{' '}
          <span>{this.props.max}</span>
          {' '}(<span>{0.5 * (this.props.min + this.props.max)}</span>)
        </p>
        <p>
          Hitpoints:{' '}
          <span>{this.props.totalHealth}</span>
        </p>
      </div>
    );
  }
}
