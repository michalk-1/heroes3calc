import React from 'react';
import style from './AttackResult.css';

export function formatResult(features, name) {
  const prop = features.get(name);
  const minimum_prop = prop.get('minimum');
  const average_prop = prop.get('average');
  const maximum_prop = prop.get('maximum');
  return minimum_prop === maximum_prop ?
    <span>{minimum_prop}</span> : (
    <span>
      {minimum_prop}{' '}-{' '}{maximum_prop}{' '}(avg {average_prop})
    </span>
  );
}

export function AttackResult({attacking}) {
  return (
    <div className={style['attack-result']}>
      <p>Damage:{' '}{formatResult(attacking, 'damage')}</p>
      <p>Losses:{' '}{formatResult(attacking, 'losses')}</p>
      <p>Remaining:{' '}{formatResult(attacking, 'remaining')}</p>
    </div>
  );
}
