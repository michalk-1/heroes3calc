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
    this.state = {level_index: 0};
  }

  render() {
    const state = this.state
    const level_index = state.level_index;
    const props = this.props;
    const onGuardClick = props.onGuardClick;
    const bank = props.bank;
    const bank_image = bank.get('image');
    const bank_name = bank.get('name');
    console.log('bank name', bank_name);
    const levels = bank.get('levels');
    console.log('levels', levels.toJS());
    console.log('level_index', level_index);
    const level = levels.get(level_index);  // show only one level
    console.log('level', level.toJS());
    const guards = level.get('guards');
    return (
      <div className={style['creature-bank']}>
        <Bank image={bank_image} name={bank_name} onClick={() => {
          this.setState((s) => {
            const level_index = state.level_index;
            const next_level_index = (level_index + 1) % levels.length;
            return {level_index: next_level_index};
          });
        }}/>
        <div className={style.guards}>
          {guards.map((guard, i) => {
            const creature = guard.get('creature');
            const creature_name = creature.get('name');
            const creature_image = creature.get('image');
            const guard_number = creature.get('number');
            return <div id={`${bank_name}_${creature_name}_${i}`} className={style.guard}>
              <div className={style.number}>{guard_number}</div>
              <Creature image={creature_image} name={creature_name} onClick={() => onGuardClick(guard)}/>
            </div>
          }
          )}
        </div>
      </div>
    );
  }
}

