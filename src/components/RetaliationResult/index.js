import React from 'react';
import style from './RetaliationResult.css';
import { formatResult } from '../AttackResult/index.js';

export class RetaliationResult extends React.Component {
  render() {
    const result = formatResult(this.props);
    return (
      <div className={style['retaliation-result']}>
        <p>Losses:{' '}{result.losses}</p>
        <p>Damage:{' '}{result.damage}</p>
        <p>Remaining:{' '}{result.remaining}</p>
      </div>
    );
  }
}
