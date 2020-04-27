import Immutable from 'immutable';
import React from 'react';
import style from './Calc.css';
import {AttackResult} from '../AttackResult/index';
import {Creatures, asyncGetBanks, asyncGetCreatureData} from '../Creatures/index';
import {Features} from '../Features/index';
import {RetaliationResult} from '../RetaliationResult/index';
import applib from "../../app-lib";
import {
  calcAverage,
  calcTotalHealth,
  extractNumber,
  optimizeAttackingAttack,
  optimizeAttackingNumber,
} from "../../calc-lib";
import {NAMES, TITLES, FEATURE_TYPES} from '../../data';
import {addToHistory, moveZipper, overwriteLastInHistory} from '../../history-lib';
import {memoize} from "../../immutable-lib";

const emptyForm = memoize(applib.emptyForm);
const stateUpdate = memoize(applib.stateUpdate);

type CalcProps = {};
type CalcState = {
  attacking: any,
  defending: any,
  history: any,
  future: any,
};

export class Calc extends React.Component<CalcProps, CalcState> {

  banks: any
  creature_data: any

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
      const number_opt = optimizeAttackingNumber(attacking_avg, defending_th) ;
      this.setState(state => {
        const attacking_opt = state.attacking.set('amount', number_opt);
        return Object.assign(state, stateUpdate(attacking_opt, state.defending));
      });
    } else if (field_name === NAMES[TITLES.additional_attack]) {
      const additional_attack_opt = optimizeAttackingAttack(attacking_avg, defending_th);
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
      const history_future = addToHistory(state);
      const attacking_defending = stateUpdate(state.defending, state.attacking);
      return Object.assign({}, history_future, attacking_defending);
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
      const history_state = (
        (input_name === 'name' && creature_data && creature_data.hasCreature(parsed_value))
        ? addToHistory(state)
        : {history: overwriteLastInHistory(state)}
      );
      const features = state[features_type].set(input_name, parsed_value);
      return Object.assign(history_state, Calc.dispatchStateUpdate(state, features, features_type));
    });
  }

  propagateGuardFeatures(guard){
    this.setState(state => {
      const creature = guard.get('creature');
      const number = guard.get('number');
      const features_type = FEATURE_TYPES.defending;
      const features = state[features_type].merge(creature).set('amount', number);
      const history_future = addToHistory(state);
      return Object.assign(history_future, Calc.dispatchStateUpdate(state, features, features_type));
    })
  }

  propagateCreatureFeatures(features_type, creature) {
    this.setState(state => {
      const features = state[features_type].merge(creature);
      const history_future = addToHistory(state);
      return Object.assign(history_future, Calc.dispatchStateUpdate(state, features, features_type));
    });
  }

  goBack() {
    this.setState(state => {
      const [previous, middle, next] = moveZipper(state, state.future, state.history);
      return Object.assign({future: previous, history: next}, middle);
    });
  }

  goForward() {
    this.setState(state => {
      const [previous, middle, next] = moveZipper(state, state.history, state.future);
      return Object.assign({history: previous, future: next}, middle);
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
