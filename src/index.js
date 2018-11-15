import React from 'react';
import ReactDOM from 'react-dom';
import style from './Calc.css';
import { AttackResult } from './components/AttackResult/index.js';
import { RetaliationResult } from './components/RetaliationResult/index.js';
import { CalcInput } from './components/CalcInput/index.js';
import { calcMin, calcMax, calcTotalHealth, calcLosses } from './calc-lib.js';
import { Creatures } from './components/Creatures/index.js';
import { Features } from './components/Features/index.js';
import { getCookie, setCookie } from './cookie-lib.js';
import { NUMBER_NAMES, STRING_NAMES } from './data.js';
import { parseObject, parseType, toggleClass } from  './util.js';

class Calc extends React.Component {
  constructor(props) {
    super(props);

    let init = Object.assign(...NUMBER_NAMES.map(x => ({[x]: 5})));
    init.amount = 1;
    init = Object.assign(...STRING_NAMES.map(x => ({[x]: ''})), init);
    const attacking = parseObject(Object.assign(init, getCookie('attacking')));
    const defending = parseObject(Object.assign(init, getCookie('defending')));

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCreatureClick = this.handleCreatureClick.bind(this);
    this.handleFeaturesClick = this.handleFeaturesClick.bind(this);
    let state_update = this.stateUpdate(attacking, defending);
    this.state = {
      toggle: 'attacking',
      attacking: attacking,
      defending: defending,
      minimum_damage: state_update.minimum_damage,
      maximum_damage: state_update.maximum_damage,
      average_damage: state_update.average_damage,
      defending_total_health: state_update.defending_total_health,
    }
  }

  handleInputChange(features_type, input_name, input_value) {
    let state_class = this.state[features_type];
    state_class[input_name] = parseType(input_name, input_value);

    let res = undefined;
    if (features_type === 'attacking') {
      res = this.stateUpdate(this.state[features_type], this.state.defending);
    } else {
      res = this.stateUpdate(this.state.attacking, this.state[features_type]);
    }
    console.log(res);
    this.setState(res);
  }

  stateUpdate(attacking, defending) {
    const minimum_damage = calcMin(attacking, defending);
    const maximum_damage = calcMax(attacking, defending);
    const average_damage = 0.5 * (minimum_damage + maximum_damage);
    const defending_total_health = calcTotalHealth(defending);
    const defending_minimum_losses = calcLosses(defending, minimum_damage)
    const defending_average_losses = calcLosses(defending, average_damage)
    const defending_maximum_losses = calcLosses(defending, maximum_damage)
    const defending_minimum_units_left = defending.amount - defending_maximum_losses;
    const defending_average_units_left = defending.amount - defending_average_losses;
    const defending_maximum_units_left = defending.amount - defending_minimum_losses;
    const defending_minimum_damage = calcMin(Object.assign({}, defending, {amount: defending_minimum_units_left}), attacking);
    const defending_maximum_damage = calcMax(Object.assign({}, defending, {amount: defending_maximum_units_left}), attacking);
    const defending_average_damage = 0.5 * (defending_minimum_damage + defending_maximum_damage);
    const minimum_losses = calcLosses(attacking, defending_minimum_damage);
    const average_losses = calcLosses(attacking, defending_average_damage);
    const maximum_losses = calcLosses(attacking, defending_maximum_damage);
    const minimum_units_left = attacking.amount - maximum_losses;
    const average_units_left = attacking.amount - average_losses;
    const maximum_units_left = attacking.amount - minimum_losses;
    return {
      attacking: attacking,
      defending: defending,
      minimum_damage: minimum_damage,
      average_damage: average_damage,
      maximum_damage: maximum_damage,
      minimum_losses: minimum_losses,
      average_losses: average_losses,
      maximum_losses: maximum_losses,
      minimum_units_left: minimum_units_left,
      average_units_left: average_units_left,
      maximum_units_left: maximum_units_left,
      defending_minimum_damage: defending_minimum_damage,
      defending_average_damage: defending_average_damage,
      defending_maximum_damage: defending_maximum_damage,
      defending_minimum_losses: defending_minimum_losses,
      defending_average_losses: defending_average_losses,
      defending_maximum_losses: defending_maximum_losses,
      defending_minimum_units_left: defending_minimum_units_left,
      defending_average_units_left: defending_average_units_left,
      defending_maximum_units_left: defending_maximum_units_left,
    };
  }

  handleCreatureClick(creature) {
    const features_type = this.state.toggle;
    const data = Object.assign({}, this.state[features_type], creature);
    setCookie(features_type, data);
    this.setState({
      [features_type]: data,
      toggle: toggleClass(features_type),
    });
  }

  handleFeaturesClick(features_type) {
    this.setState({toggle: features_type});
  }

  render() {
    console.log('render', this.state.minimum_damage);
    const attacking_active = this.state.toggle === 'attacking';
    const defending_active = this.state.toggle === 'defending';
    return (
      <div className={style.calc}>
        <div className={style.attacking}>
          <Features type="attacking" values={this.state.attacking}
                    active={attacking_active} onInputChange={this.handleInputChange}
                    onClick={this.handleFeaturesClick}/>
        </div>
        <div className={style.defending}>
          <Features type="defending" values={this.state.defending}
                    active={defending_active} onInputChange={this.handleInputChange}
                    onClick={this.handleFeaturesClick}/>
        </div>
        <div className={style['attack-result']}>
          <AttackResult
            minimum_damage={this.state.minimum_damage}
            average_damage={this.state.average_damage}
            maximum_damage={this.state.maximum_damage}
            minimum_kills={this.state.defending_minimum_losses}
            average_kills={this.state.defending_average_losses}
            maximum_kills={this.state.defending_maximum_losses}
            minimum_units_left={this.state.minimum_units_left}
            average_units_left={this.state.average_units_left}
            maximum_units_left={this.state.maximum_units_left}
          />
        </div>
        <div className={style['retaliation-result']}>
          <RetaliationResult
            minimum_units_left={this.state.defending_minimum_units_left}
            average_units_left={this.state.defending_average_units_left}
            maximum_units_left={this.state.defending_maximum_units_left}
            minimum_damage={this.state.defending_minimum_damage}
            average_damage={this.state.defending_average_damage}
            maximum_damage={this.state.defending_maximum_damage}
            minimum_kills={this.state.minimum_losses}
            average_kills={this.state.average_losses}
            maximum_kills={this.state.maximum_losses}
          />
        </div>
        <div className={style.creatures}>
          <Creatures onClick={this.handleCreatureClick}/>
        </div>
        <div className={style['creature-banks']}>
          <iframe title="Creature Banks" width="400" height="300" src="creature_banks.html"/>
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
