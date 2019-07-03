import React from 'react';
import style from './AttackResult.css';

export function formatResult(props, name) {
  const prop = props.get(name);
  const minimum_prop = prop.get('minimum');
  const average_prop = prop.get('average');
  const maximum_prop = prop.get('maximum');
  return minimum_prop === maximum_prop ?
    <span>{minimum_prop}</span> : (
    <span>{minimum_prop}{' '}-{' '}{maximum_prop}{' '}(avg {average_prop})</span>
  );
}

export function AttackResult(props) {
  return (
    <div className={style['attack-result']}>
      <p>Damage:{' '}{formatResult(props, 'damage')}</p>
      <p>Losses:{' '}{formatResult(props, 'losses')}</p>
      <p>Remaining:{' '}{formatResult(props, 'remaining')}</p>
    </div>
  );
}
