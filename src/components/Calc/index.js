import Immutable from 'immutable';
import React from 'react';
import applib from "../../app-lib";
import style from './Calc.css';
import {AttackResult} from '../AttackResult/index.js';
import {Creatures, asyncGetBanks, asyncGetCreatureData} from '../Creatures/index.js';
import {Features} from '../Features/index.js';
import {RetaliationResult} from '../RetaliationResult/index.js';
import {NAMES, TITLES, FEATURE_TYPES} from '../../data.js';
import {calcModifier, extractNumber, calcAverage, calcTotalHealth} from "../../calc-lib.js";
import {memoize} from "../../immutable-lib";

const emptyForm = memoize(applib.emptyForm);
const stateUpdate = memoize(applib.stateUpdate);

function featuresEqual(lhs, rhs) {
  if (lhs === undefined && rhs === undefined)
    return true;

  if (lhs === undefined || rhs === undefined)
    return false;

  return Immutable.is(lhs.attacking, rhs.attacking) && Immutable.is(lhs.defending, rhs.defending);
}

export class Calc extends React.Component {

  constructor(props) {
    super(props);
    this.banks = Immutable.List();
    this.state = Object.assign(
      {
        history: Immutable.List(),
        future: Immutable.List(),
      },
      stateUpdate(emptyForm(), emptyForm()),
    );
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.swapFeatureTypes = this.swapFeatureTypes.bind(this);
    this.creature_data = undefined;
    const creature_data_promise = asyncGetCreatureData();
    creature_data_promise.then(creature_data => { this.creature_data = creature_data; });
    const banks_promise = asyncGetBanks(
      creature_data_promise.then(creature_data => creature_data.by_name)
    );
    banks_promise.then(banks => {
      this.banks = banks;
      this.forceUpdate();
    })
  }

  static addToHistory(state) {
      const current = {attacking: state.attacking, defending: state.defending};
      const last = state.history.last();
      if (featuresEqual(last, current)) {
        return [state.history, state.future];
      } else {
        const history = state.history.push(Object.freeze(current));
        const future = Immutable.List();
        return [history, future];
      }
  }

  static overwriteLastInHistory(state) {
      const current = {attacking: state.attacking, defending: state.defending};
      const history = state.history;
      return state.history.update(history.size - 1, () => current);
  }

  static optimizeAttackingNumber(attacking_avg, defending_th) {
    const a_attack = extractNumber(attacking_avg, 'attack');
    const a_damage = extractNumber(attacking_avg.get('damage'), 'average');
    const a_additional_attack = extractNumber(attacking_avg, 'additional_attack');
    const d_additional_defense = extractNumber(defending_th, 'additional_defense');
    const d_defense = extractNumber(defending_th, 'defense');
    const d_reduction = 1 - extractNumber(defending_th, 'damage_reduction') / 100;
    const d_total_health = extractNumber(defending_th, 'total_health');
    const a_total_attack = a_attack + a_additional_attack;
    const d_total_defense = d_defense + d_additional_defense;
    const modifier = calcModifier(a_total_attack, d_total_defense);
    const number = d_total_health / (modifier * a_damage * d_reduction);
    const number_1 = Math.ceil(number);
    const number_2 = Number.isNaN(number_1) ? 0 : number_1;
    return number_2;
  }

  static sanitizeResult(additional_attack) {
      const additional_attack_1 = Math.ceil(additional_attack);
      const additional_attack_2 = additional_attack_1 < 0 ? 0 : additional_attack_1;
      const additional_attack_3 = Number.isNaN(additional_attack_2) ? 0 : additional_attack_2;
      return additional_attack_3;
  }

  static optimizeAttackingAttack(attacking_avg, defending_th) {
    const a_attack = extractNumber(attacking_avg, 'attack');
    const a_damage = extractNumber(attacking_avg.get('damage'), 'average');
    const a_number = extractNumber(attacking_avg, 'amount');
    const d_additional_defense = extractNumber(defending_th, 'additional_defense');
    const d_defense = extractNumber(defending_th, 'defense');
    const d_reduction = 1 - extractNumber(defending_th, 'damage_reduction') / 100;
    const d_total_health = extractNumber(defending_th, 'total_health');
    const d_total_defense = d_defense + d_additional_defense;
    const calcAdditionalAttack = (multiplier) => {
      let a_attack_opt;
      a_attack_opt = d_total_health
      a_attack_opt += a_damage * a_number * d_reduction * (d_total_defense * multiplier - 1);
      a_attack_opt /= a_damage * a_number * d_reduction * multiplier;
      const additional_attack_1 = a_attack_opt - a_attack;
      const additional_attack_2 = Calc.sanitizeResult(additional_attack_1);
      const modifier = 1 + multiplier * (a_attack + additional_attack_2 - d_total_defense);
      if (modifier < 0.01 || 8.0 < modifier) {
        let total_attack_alt;
        total_attack_alt = (multiplier * d_total_defense + modifier_cap - 1);
        total_attack_alt /= multiplier;
        return Calc.sanitizeResult(total_attack_alt - a_attack);
      } else {
        return additional_attack_2;
      }
    }
    const a_multiplier = 0.05;
    const a_modifier_cap = 8.0;
    const additional_attack = calcAdditionalAttack(a_multiplier, a_modifier_cap);
    if (additional_attack + a_attack < d_total_defense) {
      const d_modifier_cap = 0.01;
      const d_multiplier = 0.025;
      return calcAdditionalAttack(d_multiplier, d_modifier_cap);
    } else {
      return additional_attack;
    }
  }

  optimizeOneHitAttacking(field_name) {
    const state = this.state;
    const attacking = state.attacking;
    const defending = state.defending;
    const defending_th = calcTotalHealth(defending);
    const attacking_avg = attacking.set('damage', calcAverage(Immutable.Map({
      minimum: extractNumber(attacking, 'minimum_damage'),
      maximum: extractNumber(attacking, 'maximum_damage'),
    })));
    if (field_name === NAMES[TITLES.amount]) {
      const number_opt = Calc.optimizeAttackingNumber(attacking_avg, defending_th) ;
      this.setState(state => {
        const attacking_opt = state.attacking.set('amount', number_opt);
        return Object.assign(state, stateUpdate(attacking_opt, state.defending));
      });
    } else if (field_name === NAMES[TITLES.additional_attack]) {
      const additional_attack_opt = Calc.optimizeAttackingAttack(attacking_avg, defending_th);
      this.setState(state => {
        const attacking_opt = state.attacking.set('additional_attack', additional_attack_opt)
        return Object.assign(state, stateUpdate(attacking_opt, state.defending))
      })
    } else {
      throw Error(`Unsupported field '${field_name}'.`);
    }
  }

  swapFeatureTypes() {
    this.setState(state => {
      [state.history, state.future] = Calc.addToHistory(state);
      const attacking = state.attacking;
      const defending = state.defending;
      return Object.assign(state, stateUpdate(defending, attacking));
    });
  }

  static dispatchStateUpdate(state, features, features_type) {
    if (features_type === 'attacking') {
      return stateUpdate(features, state.defending);
    } else { // features_type === 'defending'
      return stateUpdate(state.attacking, features);
    }
  }

  propagateFeatureChange(features_type, input_name, parsed_value) {
    this.setState(state => {
      const creature_data = this.creature_data;
      if (input_name === 'name' && creature_data && creature_data.hasCreature(parsed_value)) {
        [state.history, state.future] = Calc.addToHistory(state);
      } else {
        state.history = Calc.overwriteLastInHistory(state);
      }
      const features = state[features_type].set(input_name, parsed_value);
      return Object.assign(state, Calc.dispatchStateUpdate(state, features, features_type));
    });
  }

  propagateGuardFeatures(guard){
    this.setState(state => {
      const creature = guard.get('creature');
      const number = guard.get('number');
      const features_type = FEATURE_TYPES.defending;
      const features = state[features_type].merge(creature).set('amount', number);
      [state.history, state.future] = Calc.addToHistory(state);
      return Object.assign(state, Calc.dispatchStateUpdate(state, features, features_type));
    })
  }

  propagateCreatureFeatures(features_type, creature) {
    this.setState(state => {
      const features = state[features_type].merge(creature);
      [state.history, state.future] = Calc.addToHistory(state);
      return Object.assign(state, Calc.dispatchStateUpdate(state, features, features_type));
    });
  }

  static saveCurrent(state, previous) {
    const current = {
      attacking: state.attacking,
      defending: state.defending
    };

    return featuresEqual(current, previous.last())
      ? previous
      : previous.push(Object.freeze(current));
  }

  static moveZipper(state, previous, next) {
    if (next.size <= 0) {
      return [previous, state, next];
    } else {
      return [Calc.saveCurrent(state, previous), next.last(), next.pop()];
    }
  }

  goBack() {
    this.setState(state => {
      const [previous, middle, next] = Calc.moveZipper(state, state.future, state.history);
      [state.future, state.history] = [previous, next];
      return Object.assign(state, middle);
    });
  }

  goForward() {
    this.setState(state => {
      const [previous, middle, next] = Calc.moveZipper(state, state.history, state.future);
      [state.history, state.future] = [previous, next];
      return Object.assign(state, middle);
    });
  }

  render() {
    const state = this.state;
    const attacking = state.attacking;
    const attacking_name = attacking.get('name');
    const attacking_damage_average = attacking.getIn(['damage', 'average']);
    const attacking_losses_average = attacking.getIn(['losses', 'average']);
    const defending = state.defending;
    const defending_name = defending.get('name');
    const defending_damage_average = defending.getIn(['damage', 'average']);
    const defending_losses_average = defending.getIn(['losses', 'average']);
    const banks = this.banks;
    const creature_data = this.creature_data;
    return (
      <div className={style.calc}>
        <div className={style['attack-result']}>
          <h3>{TITLES.attacking}</h3>
          <AttackResult attacking={attacking}/>
        </div>
        <div className={style['retaliation-result']}>
          <h3>{TITLES.defending}</h3>
          <RetaliationResult defending={defending} />
        </div>
        <div className={style.tips}>
          <h3>Tips</h3>
          <div style={{padding: 16.38 + 'px'}}>
            <p>Archery: add 2, 5, or 10 to the Additional Attack field.</p>
            <p>Offense: add 2, 4, or 6 to the Additional Attack field.</p>
            <p>Armorer: put the value (5, 10, or 15) in the Damage Reduction field.</p>
          </div>
        </div>
        <Interactions
            goBack={this.goBack}
            goForward={this.goForward}
            handleSwap={this.swapFeatureTypes}
        />
        <div className={style.attacking}>
          <Features
            creature_data={creature_data}
            features_type={FEATURE_TYPES.attacking}
            values={attacking}
            onInputChange={(...xs) => this.propagateFeatureChange(...xs)}
            onCreatureChange={(...xs) => this.propagateCreatureFeatures(...xs)}
            onButtonClick={(...xs) => this.optimizeOneHitAttacking(...xs)}
          />
        </div>
        <div className={style.dummy}/>
        <div className={style.defending}>
          <Features
            creature_data={creature_data}
            features_type={FEATURE_TYPES.defending}
            values={defending}
            onCreatureChange={(...xs) => this.propagateCreatureFeatures(...xs)}
            onInputChange={(...xs) => this.propagateFeatureChange(...xs)}
            onButtonClick={(...xs) => this.optimizeOneHitAttacking(...xs)}
          />
        </div>
        <div className={style.creatures}>
          <Creatures banks={banks} onGuardClick={guard => this.propagateGuardFeatures(guard)}/>
        </div>
        <div className={style['fight-logs']}>
          The {attacking_name}s do {attacking_damage_average} damage.
          {' '}{defending_losses_average} {defending_name}s perish.<br/>
          The {defending_name}s do {defending_damage_average} damage.
          {' '}{attacking_losses_average} {attacking_name}s perish.<br/>
        </div>
      </div>
    );
  }
}

function Interactions(props) {
  const goForward = props.goForward;
  const goBack = props.goBack;
  const handleSwap = props.handleSwap;
  return (
    <div className={style.interactions}>
      <button className={`${style.interaction} ${style.noselect}`}
              onClick={goBack}>🠄</button>
      <button className={`${style.interaction} ${style.noselect}`}
              onClick={handleSwap}>⇄</button>
      <button className={`${style.interaction} ${style.noselect}`}
              onClick={goForward}>🠆</button>
    </div>
  );
}
