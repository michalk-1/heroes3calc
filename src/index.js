import React from 'react';
import ReactDOM from 'react-dom';
import style from './Calc.css';
import { AttackResult } from './components/AttackResult/index.js';
import { CalcInput } from './components/CalcInput/index.js';
import { calcMin, calcMax, calcTotalHealth } from './calc-lib.js';
import { Creatures } from './components/Creatures/index.js';
import { Features } from './components/Features/index.js';
import { getCookie, setCookie } from './cookie-lib.js';
import { NUMBER_NAMES, STRING_NAMES } from './data.js';
import { parseObject, parseType, toggleClass } from  './util.js';

class Calc extends React.Component {
  constructor(props) {
    super(props);

    let init = Object.assign(...NUMBER_NAMES.map(x => ({[x]: 0})));
    init.amount = 1;
    init = Object.assign(...STRING_NAMES.map(x => ({[x]: ''})), init);
    const attacking = parseObject(Object.assign(init, getCookie('attacking')));
    const defending = parseObject(Object.assign(init, getCookie('defending')));

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCreatureClick = this.handleCreatureClick.bind(this);
    this.handleFeaturesClick = this.handleFeaturesClick.bind(this);
    this.state = {
      attacking: attacking,
      defending: defending,
      toggle: 'attacking',
    }
  }

  handleInputChange(features_type, input_name, input_value) {
    let state_class = this.state[features_type];
    state_class[input_name] = parseType(input_name, input_value);
    this.setState({[features_type]: state_class});
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
            min={calcMin(this.state.attacking, this.state.defending)}
            max={calcMax(this.state.attacking, this.state.defending)}
            total_health={calcTotalHealth(this.state.defending)}
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
