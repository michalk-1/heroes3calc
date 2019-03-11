import React from 'react';
import ReactDOM from 'react-dom';
import style from './Calc.css';
import { AttackResult } from './components/AttackResult/index.js';
import { RetaliationResult } from './components/RetaliationResult/index.js';
import { CalcInput } from './components/CalcInput/index.js';
import { stateUpdate } from './calc-lib.js';
import { CreatureData, Creatures } from './components/Creatures/index.js';
import { Features } from './components/Features/index.js';
import { Dropdown } from './components/Dropdown/index.js';
import { getCookie, setCookie } from './cookie-lib.js';
import { NUMBER_NAMES, STRING_NAMES, TITLES } from './data.js';
import { parseObject, toggleClass } from  './util.js';

class Calc extends React.Component {
  constructor(props) {
    super(props);
    const init = Calc.emptyForm();
    const attacking = parseObject(Object.assign(init, getCookie('attacking')));
    const defending = parseObject(Object.assign(init, getCookie('defending')));
    const state_update = stateUpdate(attacking, defending);
    this.state = Object.assign({toggle: 'attacking'}, state_update);
    this.state.creature_data = new CreatureData(this);
  }

  static emptyForm() {
    let init = Object.assign(...NUMBER_NAMES.map(x => ({[x]: 0})));
    init.amount = 1;
    init = Object.assign(...STRING_NAMES.map(x => ({[x]: ''})), init);
    return init
  }

  stateUpdateByType(features, features_type) {
    if (features_type === 'attacking') {
      return stateUpdate(features, this.state.defending);
    } else {
      return stateUpdate(this.state.attacking, features);
    }
  }

  handleInputChange(features_type, input_name, parsed_value) {
    let features = this.state[features_type];
    features[input_name] = parsed_value;
    this.setState(this.stateUpdateByType(features, features_type));
  }

  handleCreatureClick(creature) {
    const features_type = this.state.toggle;
    const features = Object.assign({}, this.state[features_type], creature);
    setCookie(features_type, features);
    let state = this.stateUpdateByType(features, features_type);
    state['toggle'] = toggleClass(features_type);
    this.setState(state);
  }

  handleFeaturesClick(type) {
    this.setState({toggle: type});
  }

  render() {
    const attacking_active = this.state.toggle === 'attacking';
    const defending_active = this.state.toggle === 'defending';
    return (
      <div className={style.calc}>
        <div className={style.attacking}>
          <Features type="attacking" values={this.state.attacking}
                    active={attacking_active} onInputChange={(...xs) => this.handleInputChange(...xs)}
                    onClick={type => this.handleFeaturesClick(type)}/>
        </div>
        <div className={style.defending}>
          <Features type="defending" values={this.state.defending}
                    active={defending_active} onInputChange={(...xs) => this.handleInputChange(...xs)}
                    onClick={type => this.handleFeaturesClick(type)}/>
        </div>
        <div className={style['attack-result']}>
          <h3>{TITLES.attacking}</h3>
          <AttackResult
            minimum_damage={this.state.minimum_damage}
            average_damage={this.state.average_damage}
            maximum_damage={this.state.maximum_damage}
            minimum_losses={this.state.minimum_losses}
            average_losses={this.state.average_losses}
            maximum_losses={this.state.maximum_losses}
            minimum_units_left={this.state.minimum_units_left}
            average_units_left={this.state.average_units_left}
            maximum_units_left={this.state.maximum_units_left}
          />
        </div>
        <div className={style['retaliation-result']}>
          <h3>{TITLES.defending}</h3>
          <RetaliationResult
            minimum_damage={this.state.defending_minimum_damage}
            average_damage={this.state.defending_average_damage}
            maximum_damage={this.state.defending_maximum_damage}
            minimum_losses={this.state.defending_minimum_losses}
            average_losses={this.state.defending_average_losses}
            maximum_losses={this.state.defending_maximum_losses}
            minimum_units_left={this.state.defending_minimum_units_left}
            average_units_left={this.state.defending_average_units_left}
            maximum_units_left={this.state.defending_maximum_units_left}
          />
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
          <Creatures creature_data={this.state.creature_data} onClick={creature => this.handleCreatureClick(creature)}/>
        </div>
        <div className={style.fight_logs}>
          {this.state.attacking.amount} attacking creatures do {this.state.minimum_damage} - {this.state.maximum_damage} damage.<br/>
          {this.state.defending_minimum_losses} - {this.state.defending_maximum_losses} defending creatures perish.<br/>
          {this.state.defending_minimum_units_left} - {this.state.defending_maximum_units_left} defending creatures remain and do
          {' '}{this.state.defending_minimum_damage} - {this.state.defending_maximum_damage} damage.<br/>
          {this.state.minimum_losses} - {this.state.maximum_losses} attacking creatures perish and
          {' '}{this.state.minimum_units_left} - {this.state.maximum_units_left} remain.<br/>
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
