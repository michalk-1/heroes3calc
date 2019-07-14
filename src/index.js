import React from 'react';
import ReactDOM from 'react-dom';
import style from './Calc.css';
import {AttackResult} from './components/AttackResult/index.js';
import {RetaliationResult} from './components/RetaliationResult/index.js';
import {CreatureData, Creatures} from './components/Creatures/index.js';
import {Features} from './components/Features/index.js';
import {TITLES} from './data.js';
import applib from "./app-lib";
import {memoize} from "./immutable-lib";
import Immutable from 'immutable';

window.Immutable = Immutable;
const emptyForm = memoize(applib.emptyForm);
const stateUpdate = memoize(applib.stateUpdate);

function featuresEqual(lhs, rhs) {
  return lhs.attacking === rhs.attacking && lhs.defending === rhs.defending;
}

class Calc extends React.Component {

  constructor(props) {
    super(props);
    this.creature_data = new CreatureData(this);
    const current = stateUpdate(emptyForm(), emptyForm());
    this.state = Object.assign(
      {
        toggle: 'attacking',
        history: Immutable.List([current]),
        future: Immutable.List(),
      },
      current,
    );
  }

  handleSwap() {
    this.setState(state => {
      const attacking = state.attacking;
      const defending = state.defending;
      const current = stateUpdate(defending, attacking);
      const last = state.history.last();
      if (!featuresEqual(current, last)) {
        state.history = state.history.push(current);
        state.future = Immutable.List();
      }
      return Object.assign(state, current);
    });
  }

  dispatchStateUpdate(features, features_type) {
    if (features_type === 'attacking') {
      const defending = this.state.defending;
      return stateUpdate(features, defending);
    } else {
      const attacking = this.state.attacking;
      return stateUpdate(attacking, features);
    }
  }

  // features_type: {attacking,defending}
  handleInputChange(features_type, input_name, parsed_value) {
    this.setState(state => {
      let features = state[features_type];
      features = features.set(input_name, parsed_value);
      const current = this.dispatchStateUpdate(features, features_type);
      const last = state.history.last();
      if (input_name === 'name' && this.creature_data.hasCreature(parsed_value)) {
        if (!featuresEqual(current, last)) {
          state.history = state.history.push(current);
          state.future = Immutable.List();
        }
      } else {
        state.history = state.history.update(state.history.length - 1, () => current);
      }
      return Object.assign(state, current);
    });
  }

  handleCreatureClick(creature) {
    this.setState(state => {
      const features_type = state.toggle;
      let features = state[features_type];
      features = features.merge(creature);
      const current = this.dispatchStateUpdate(features, features_type);
      const last = state.history.last();
      if (!featuresEqual(current, last)) {
        state.history = state.history.push(current);
        state.future = Immutable.List();
      }
      return Object.assign(state, current);
    });
  }

  handleFeaturesClick(type) {
    this.setState({toggle: type});
  }

  goBack() {
    this.setState(state => {
      const current = {attacking: state.attacking, defending: state.defending};
      const last = state.history.last();
      state.future = state.future.push(current);
      state.history = state.history.pop();
      return Object.assign(state, last);
    });
  }

  goForward() {
    this.setState(state => {
      const current = {attacking: state.attacking, defending: state.defending};
      const next = state.future.last();
      state.history = state.history.push(current);
      state.future = state.future.pop();
      return Object.assign(state, next);
    });
  }

  render() {
    const attacking_active = this.state.toggle === 'attacking';
    const defending_active = this.state.toggle === 'defending';
    const attacking = this.state.attacking;
    const attacking_name = attacking.get('name');
    const attacking_damage_average = attacking.getIn(['damage', 'average']);
    const attacking_losses_average = attacking.getIn(['losses', 'average']);
    const defending = this.state.defending;
    const defending_name = defending.get('name');
    const defending_damage_average = defending.getIn(['damage', 'average']);
    const defending_losses_average = defending.getIn(['losses', 'average']);
    return (
      <div className={style.calc}>
        <div><button onClick={() => this.goBack()}>Back</button></div>
        <div><button onClick={() => this.goForward()}>Forward</button></div>
        <div className={style.attacking}>
          <Features type="attacking"
                    values={attacking}
                    active={attacking_active}
                    onInputChange={(...xs) => this.handleInputChange(...xs)}
                    onClick={type => this.handleFeaturesClick(type)}
                    onCreatureChange={creature => this.handleCreatureClick(creature)}
                    creature_data={this.creature_data}
          />
        </div>
        <div className={style.interactions}>
          <div className={`${style.interaction} ${style.noselect}`}
               onClick={() => this.handleSwap()}
          >
          ⇄
          </div>
        </div>
        <div className={style.defending}>
          <Features type="defending"
                    values={defending}
                    active={defending_active}
                    onInputChange={(...xs) => this.handleInputChange(...xs)}
                    onClick={type => this.handleFeaturesClick(type)}
                    onCreatureChange={creature => this.handleCreatureClick(creature)}
                    creature_data={this.creature_data}
          />
        </div>
        <div className={style['attack-result']}>
          <h3>{TITLES.attacking}</h3>
          <AttackResult attacking={attacking}/>
        </div>
        <div className={style.dummy}/>
        <div className={style['retaliation-result']}>
          <h3>{TITLES.defending}</h3>
          <RetaliationResult defending={defending} />
        </div>
        <div className='tips'>
          <h3>Tips</h3>
          <div style={{padding: 16.38 + 'px'}}>
            <p>Archery: add 2, 5, or 10 to the Additional Attack field.</p>
            <p>Offense: add 2, 4, or 6 to the Additional Attack field.</p>
            <p>Armorer: put the value (5, 10, or 15) in the Damage Reduction field.</p>
          </div>
        </div>
        <div className={style.creatures}>
          <Creatures creature_data={this.creature_data}
                     onClick={creature => this.handleCreatureClick(creature)}
          />
        </div>
        <div className={style['fight-logs']}>
          The {attacking_name}s do {attacking_damage_average} damage.
          {' '}{defending_losses_average} {defending_name}s perish.<br/>
          The {defending_name}s do {defending_damage_average} damage.
          {' '}{attacking_losses_average} {attacking_name}s perish.<br/>
          History: {this.state.history.length}<br/>
          Future: {this.state.future.length}<br/>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Calc />,
  document.getElementById('index')
);
