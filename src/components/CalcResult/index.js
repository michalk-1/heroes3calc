import React from 'react';
import style from './CalcResult.css';

export class CalcResult extends React.Component {
  render() {
    return (
      <div className={style['calc-result']}>
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
