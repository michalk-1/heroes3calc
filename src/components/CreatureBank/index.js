import React from 'react';
import style from './CreatureBank.css';
import { Creature } from '../Creature/index.js';
import { Bank } from '../Bank/index.js';

export class CreatureBank extends React.Component {
  // bank: image, name, levels, onGuardClick
  // level: guard
  // guard: creature, number
  // creature: image, name

  constructor(props) {
    super(props);
    this.state = {level: 0};
  }

  render() {
    const state = this.state
    const level_index = state.level_index;
    const props = this.props;
    const onGuardClick = props.onGuardClick;
    const bank = props.bank;
    const levels = bank.levels;
    const guards = levels[level_index];  // show only one level
    return (
      <div className={style['creature-bank']}>
        <Bank image={bank.image} name={bank.name} onClick={() => {
          this.setState((s) => {
            const level_index = state.level_index;
            const next_level_index = (level_index + 1) % levels.length;
            return {level_index: next_level_index};
          });
        }}/>
        <div className={style.guards}>
          {guards.map((guard, i) => {
            const creature = guard.creature;
            return <div id={`${bank.name}_${creature.name}_${i}`} className={style.guard}>
              <div className={style.number}>{guard.number}</div>
              <Creature image={creature.image} name={creature.name} onClick={() => onGuardClick(guard)}/>
            </div>
          }
          )}
        </div>
      </div>
    );
  }
}

