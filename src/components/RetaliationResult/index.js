import React from 'react';
import style from './RetaliationResult.css';
import {formatResult} from "../AttackResult";

export function RetaliationResult(props) {
  return (
    <div className={style['retaliation-result']}>
      <p>Losses:{' '}{formatResult(props, 'losses')}</p>
      <p>Damage:{' '}{formatResult(props, 'damage')}</p>
      <p>Remaining:{' '}{formatResult(props, 'remaining')}</p>
    </div>
  );
}
