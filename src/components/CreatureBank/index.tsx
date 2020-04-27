import React from 'react';
import style from './CreatureBank.css';
import { Bank } from '../Bank/index';

type CreatureBankProps = {
  onGuardClick: (guard: any) => void,
  bank: any,
};

type CreatureBankState = {
  level_index: number,
  guard_index: number,
  prev_guard_index: number,

};

export class CreatureBank extends React.Component<CreatureBankProps, CreatureBankState> {
  // bank: image, name, levels, onGuardClick
  // level: guard
  // guard: creature, number
  // creature: image, name

  constructor(props) {
    super(props);
    const guards = props.bank.getIn(['levels', 0, 'guards']);
    const guard_index = guards.size > 3 ? 2 : 0;
    this.state = {level_index: 0, guard_index: guard_index, prev_guard_index: guard_index};
  }

  toggleNextLevel(levels) {
    this.setState((state, props) => {
      const level_index = state.level_index;
      const next_level_index = (level_index + 1) % levels.size;
      const level = levels.get(next_level_index);
      const guards = level.get('guards');
      const guard_index = state.guard_index;
      const prev_guard_index = state.prev_guard_index;
      const next_guard = (
        guard_index < guards.size
        ? guards.get(guard_index)
        : guards.get(prev_guard_index)
      );
        props.onGuardClick(next_guard);
        return {level_index: next_level_index};
    });
  }

  onGuardClick(guard, i: number) {
    this.setState((state, props) => {
      props.onGuardClick(guard);
      const prev_candidate = state.guard_index;
      const prev_guard_index = prev_candidate !== i ? prev_candidate : state.prev_guard_index;
      return {guard_index: i, prev_guard_index: prev_guard_index};
    });
  }

  render() {
    const state = this.state
    const level_index = state.level_index;
    const props = this.props;
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
        <Bank image={bank_image} name={bank_name} onClick={() => this.toggleNextLevel(levels)}/>
        <div className={style['guards-container']}>
        <div className={style.guards}>
          {guards.map((guard, i) => {
            const creature = guard.get('creature');
            const guard_number = guard.get('number');
            const creature_name = creature.get('name');
            const creature_image = creature.get('image');
            return (
              <div key={`${bank_name}_${creature_name}_${i}`}
                   className={style.guard}
              >
                <div className={style.number}>{guard_number}</div>
                <div className={style.creature}>
                  <img src={creature_image}
                       alt={creature_name}
                       onClick={() => this.onGuardClick(guard, i)}
                  />
                </div>
              </div>
            );
          }
          )}
        </div>
        </div>
      </div>
    );
  }
}

