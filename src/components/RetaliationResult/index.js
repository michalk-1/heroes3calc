import React from 'react';
import style from './RetaliationResult.css';
import { calcAverage } from '../../calc-lib.js';


export class RetaliationResult extends React.Component {
  render() {
    return (
      <div className={style['retaliation-result']}>
        <p>
          Remaining:{' '}
          <span>{this.props.minimum_units_left}</span>
          {' '}-{' '}
          <span>{this.props.maximum_units_left}</span>
          {' '}(<span>avg {this.props.average_units_left}</span>)
        </p>
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
      </div>
    );
  }
}
