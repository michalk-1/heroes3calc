import React from 'react';
import style from './AttackResult.css';


export class AttackResult extends React.Component {
  render() {
    console.log('render attack', this.props.minimum_damage)
    return (
      <div className={style['attack-result']}>
        <p>
          Damage:{' '}
          <span>{this.props.minimum_damage}</span>
          {' '}-{' '}
          <span>{this.props.maximum_damage}</span>
          {' '}(<span>avg {this.props.average_damage}</span>)
        </p>
        <p>
          Losses:{' '}
          <span>{this.props.minimum_losses}</span>
          {' '}-{' '}
          <span>{this.props.maximum_losses}</span>
          {' '}(<span>avg {this.props.average_losses}</span>)
        </p>
        <p>
          Remaining:{' '}
          <span>{this.props.minimum_units_left}</span>
          {' '}-{' '}
          <span>{this.props.maximum_units_left}</span>
          {' '}(<span>avg {this.props.average_units_left}</span>)
        </p>
      </div>
    );
  }
}
