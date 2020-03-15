import React from 'react';
import style from './CreatureBank.css';
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
    if (bank === undefined) {
      return <div className={style.guards} />
    }
    const bank_image = bank.get('image');
    const bank_name = bank.get('name');
    const levels = bank.get('levels');
    const level = levels.get(level_index);  // show only one level
    const guards = level.get('guards');
    return (
      <div className={style['creature-bank']}>
        <Bank image={bank_image} name={bank_name} onClick={() => {
          this.setState((state) => {
            const level_index = state.level_index;
            const next_level_index = (level_index + 1) % levels.size;
            return {level_index: next_level_index};
          });
        }}/>
        <div className={style.guards}>
          {guards.map((guard, i) => {
            const creature = guard.get('creature');
            const guard_number = guard.get('number');
            const creature_name = creature.get('name');
            const creature_image = creature.get('image');
            return <div key={`${bank_name}_${creature_name}_${i}`} className={style.guard}>
              <div className={style.number}>{guard_number}</div>
              <div className={style.creature}>
                <img src={creature_image} alt={creature_name} onClick={() => onGuardClick(guard)}/>
              </div>
            </div>
          }
          )}
        </div>
      </div>
    );
  }
}

