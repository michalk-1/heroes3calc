import React from 'react';
import style from './RetaliationResult.css';
import {formatResult} from "../AttackResult";

export function RetaliationResult(props) {
  const defending = props.defending;
  return (
    <div className={style['retaliation-result']}>
      <p>Losses:{' '}{formatResult(defending, 'losses')}</p>
      <p>Damage:{' '}{formatResult(defending, 'damage')}</p>
      <p>Remaining:{' '}{formatResult(defending, 'remaining')}</p>
    </div>
  );
}
