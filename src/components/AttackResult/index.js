import React from 'react';
import style from './AttackResult.css';

export function formatResult(props) {
    const losses = props.minimum_losses === props.maximum_losses ?
      <span>{props.minimum_losses}</span> : (
      <span>
        {props.minimum_losses} {' '}-{' '} {props.maximum_losses}
        {' '}(avg {props.average_losses})
      </span>
    );
    const damage = props.minimum_damage === props.maximum_damage ?
      <span>{props.minimum_damage}</span> : (
      <span>
        {props.minimum_damage} {' '}-{' '} {props.maximum_damage}
        {' '}(avg {props.average_damage})
      </span>
    );
    const remaining = (
      props.minimum_units_left === props.maximum_units_left ?
      <span>{props.minimum_units_left}</span> : (
      <span>
        {props.minimum_units_left} {' '}-{' '}
        {props.maximum_units_left} {' '}
        (avg {props.average_units_left})
      </span>
    ));
    return {
      losses: losses,
      damage: damage,
      remaining: remaining,
    }
}

export class AttackResult extends React.Component {
  render() {
    const result = formatResult(this.props);
    return (
      <div className={style['attack-result']}>
        <p>Damage:{' '}{result.damage}</p>
        <p>Losses:{' '}{result.losses}</p>
        <p>Remaining:{' '}{result.remaining}</p>
      </div>
    );
  }
}
