import React from 'react';
import Immutable from 'immutable';
import style from './Calc.css';
import applib from "../../app-lib";
import {TITLES} from '../../data.js';
import {memoize} from "../../immutable-lib";
import {AttackResult} from '../AttackResult/index.js';
import {Creatures, asyncGetBanks, asyncGetCreatureData} from '../Creatures/index.js';
import {Features} from '../Features/index.js';
import {RetaliationResult} from '../RetaliationResult/index.js';

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
        toggle: 'defending',
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
    const banks_promise = asyncGetBanks(creature_data_promise.then(creature_data => creature_data.by_name));
    banks_promise.then(banks => {
      this.banks = banks;
      this.forceUpdate();
    })
  }

  static addToHistory(state) {
      const current = {attacking: state.attacking, defending: state.defending};
      const last = state.history.last();
      if (!featuresEqual(last, current)) {
        const history = state.history.push(Object.freeze(current));
        const future = Immutable.List();
        return [history, future];
      } else {
        return [state.history, state.future];
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

  static overwriteLastInHistory(state) {
      const current = {attacking: state.attacking, defending: state.defending};
      const history = state.history;
      return state.history.update(history.size - 1, () => current);
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

  static getCurrentFeatures(state) {
      const features_type = state.toggle;
      const features = state[features_type];
      return features;
  }

  propagateGuardFeatures(guard){
    this.setState(state => {
      const creature = guard.get('creature');
      const number = guard.get('number')
      const features = Calc.getCurrentFeatures(state).merge(creature).set('amount', number);
      const features_type = state.toggle;
      [state.history, state.future] = Calc.addToHistory(state);
      return Object.assign(state, Calc.dispatchStateUpdate(state, features, features_type));
    })
  }

  propagateCreatureFeatures(creature) {
    this.setState(state => {
      const features = Calc.getCurrentFeatures(state).merge(creature);
      const features_type = state.toggle;
      [state.history, state.future] = Calc.addToHistory(state);
      return Object.assign(state, Calc.dispatchStateUpdate(state, features, features_type));
    });
  }

  setActiveFeatures(type) {
    this.setState({toggle: type});
  }

  static saveCurrent(state, previous) {
    const current = {
      attacking: state.attacking,
      defending: state.defending
    };

    return featuresEqual(current, previous.last()) ?
        previous : previous.push(Object.freeze(current));
  }

  static moveZipper(state, previous, next) {
    if (next.size === 0)
      return state;

    return [Calc.saveCurrent(state, previous), next.last(), next.pop()];
  }

  goBack() {
    this.setState(state => {
      let [previous, middle, next] = Calc.moveZipper(state, state.future, state.history);
      state.history = next;
      state.future = previous;
      return Object.assign(state, middle);
    });
  }

  goForward() {
    this.setState(state => {
      let [previous, middle, next] = Calc.moveZipper(state, state.history, state.future);
      state.history = previous;
      state.future = next;
      return Object.assign(state, middle);
    });
  }

  render() {
    const state = this.state;
    const attacking_active = state.toggle === 'attacking';
    const defending_active = state.toggle === 'defending';
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
          <Features type="attacking"
                    values={attacking}
                    active={attacking_active}
                    onInputChange={(...xs) => this.propagateFeatureChange(...xs)}
                    onClick={type => this.setActiveFeatures(type)}
                    onCreatureChange={creature => this.propagateCreatureFeatures(creature)}
                    creature_data={creature_data}
          />
        </div>
        <div className={style.dummy}/>
        <div className={style.defending}>
          <Features type="defending"
                    values={defending}
                    active={defending_active}
                    onInputChange={(...xs) => this.propagateFeatureChange(...xs)}
                    onClick={type => this.setActiveFeatures(type)}
                    onCreatureChange={creature => this.propagateCreatureFeatures(creature)}
                    creature_data={creature_data}
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
          History: {state.history.size}<br/>
          Future: {state.future.size}<br/>
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
