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
          Kills:{' '}
          <span>{this.props.minimum_kills}</span>
          {' '}-{' '}
          <span>{this.props.maximum_kills}</span>
          {' '}(<span>avg {this.props.average_kills}</span>)
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
