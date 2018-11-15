import React from 'react';
import style from './AttackResult.css';
import { calcAverage } from '../../calc-lib.js';

export class AttackResult extends React.Component {
  render() {
    return (
      <div className={style['calc-result']}>
        <p>
          Damage:{' '}
          <span>{this.props.min}</span>
          {' '}-{' '}
          <span>{this.props.max}</span>
          {' '}(<span>{calcAverage(this.props)}</span>)
        </p>
        <p>
          Hitpoints:{' '}
          <span>{this.props.total_health}</span>
        </p>
      </div>
    );
  }
}
