import React from 'react';
import style from './CreatureBank.css';
import { Creature } from '../Creature/index.js';
import { Bank } from '../Bank/index.js';

export class CreatureBank extends React.Component {

  render() {
    const props = this.props;
    const creature = props.guards.creature;
    const number = props.guards.number;
    const bank = props.bank;
    return (
      <div className={style['creature-bank']}>
        <Bank image={bank.image} name={bank.name} onClick={(x) => props.onClick('Bank', x)}/>
        <div className={style.guards}>
          <Creature image={creature.image} name={creature.name} onClick={(x) => props.onClick('Creature', x)}/>
          <div className={style.number}>{number}</div>
        </div>
      </div>
    );
  }
}

