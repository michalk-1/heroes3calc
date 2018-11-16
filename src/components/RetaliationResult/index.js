import React from 'react';
import style from './RetaliationResult.css';
import { calcAverage } from '../../calc-lib.js';


export class RetaliationResult extends React.Component {
  render() {
    return (
      <div className={style['retaliation-result']}>
        <p>
          Losses:{' '}
          <span>{this.props.minimum_losses}</span>
          {' '}-{' '}
          <span>{this.props.maximum_losses}</span>
          {' '}(<span>avg {this.props.average_losses}</span>)
        </p>
        <p>
          Damage:{' '}
          <span>{this.props.minimum_damage}</span>
          {' '}-{' '}
          <span>{this.props.maximum_damage}</span>
          {' '}(<span>avg {this.props.average_damage}</span>)
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
