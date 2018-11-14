import React from 'react';
import ReactDOM from 'react-dom';
import style from './Calc.css';
import { NUMBER_NAMES, STRING_NAMES } from './data.js';
import { getCookie, setCookie } from './cookie-lib.js';
import { toggleClass, calcMin, calcMax, totalHealth } from './calc-lib.js';
import { CalcResult } from './components/CalcResult/index.js';
import { CalcInput } from './components/CalcInput/index.js';
import { Creatures } from './components/Creatures/index.js';
import { Features } from './components/Features/index.js';

class Calc extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCreatureClick = this.handleCreatureClick.bind(this);
    this.resetToggle = this.resetToggle.bind(this);
    let initial  = Object.assign(...NUMBER_NAMES.map(x => ({[x]: 0})));
    initial.amount = 1;
    initial  = Object.assign(...STRING_NAMES.map(x => ({[x]: ''})), initial);
    this.state = {
      attacking: initial,
      defending: Object.assign({}, initial),
    }
    const attacking = getCookie('attacking');
    const defending = getCookie('defending');
    this.state.attacking = Object.assign({}, this.state.attacking, attacking);
    this.state.defending = Object.assign({}, this.state.defending, defending);
    this.state.toggle = 'attacking';
  }

  resetToggle() {
    if (this.state.toggle !== 'attacking') {
      this.setState({toggle: 'attacking'});
    }
  }

  handleInputChange(features_type, input_name, input_value) {
    let state_class = this.state[features_type];
    state_class[input_name] = input_value
    this.setState({[features_type]: state_class});
  }

  handleCreatureClick(creature) {
    const class_name = this.state.toggle;
    const data = Object.assign({}, this.state[class_name], creature);
    setCookie(class_name, data);
    this.setState({
      [class_name]: data,
      toggle: toggleClass(class_name),
    });
  }

  render() {
    return (
      <div className={style.calc}>
        <div className={style.attacking}>
          <Features type="attacking" values={this.state.attacking} onInputChange={this.handleInputChange}/>
        </div>
        <div className={style.defending}>
          <Features type="defending" values={this.state.defending} onInputChange={this.handleInputChange}/>
        </div>
        <div className={style['calc-result']}>
        <CalcResult min={calcMin(this.state.attacking, this.state.defending)}
                    max={calcMax(this.state.attacking, this.state.defending)}
                    totalHealth={totalHealth(this.state.defending)}/>
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
