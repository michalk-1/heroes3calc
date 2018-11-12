import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.css';
import { STATS, TITLES, NAMES } from './data.js';
import { getCookie, setCookie } from './cookie-lib.js';
import { toggleClass, calcMin, calcMax, totalHealth } from './calc-lib.js';
import { CalcResult } from './components/CalcResult/index.js';
import { CalcInput } from './components/CalcInput/index.js';
import { Creature } from './components/Creature/index.js';

class Calc extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCreatureClick = this.handleCreatureClick.bind(this);
    this.resetToggle = this.resetToggle.bind(this);
    this.state = {
      attacking: {
        additional_attack: 1,
        amount: 10,
      },
      defending: {
        additional_defense: 0,
        amount: 10,
      }
    }
    const attacking = getCookie('attacking');
    const defending = getCookie('defending');
    this.state.attacking = Object.assign({}, this.state.attacking, STATS.wolf_raider, attacking);
    this.state.defending = Object.assign({}, this.state.defending, STATS.wolf_raider, defending);
    this.state.toggle = 'attacking';

    setInterval(this.resetToggle, 5000);
  }

  resetToggle() {
    if (this.state.toggle !== 'attacking') {
      this.setState({toggle: 'attacking'});
    }
  }

  renderInput(className, title) {
    const name = NAMES[title];
    return (
      <div>
        <span>{title}: </span>
        <CalcInput value={this.state[className][name]}
                   className={className}
                   name={name}
                   onChange={(ev) => this.handleInputChange(className, name, ev.target.value)}/>
      </div>
    );
  }

  handleInputChange(className, name, value) {
    var state_class = this.state[className];
    state_class[name] = name === 'name' ? value : Number(value);
    this.setState({[className]: state_class});
  }

  handleCreatureClick(creature_name) {
    const class_name = this.state.toggle;
    const data = Object.assign({}, this.state[class_name], STATS[creature_name]);
    setCookie(class_name, data);
    this.setState({
      [class_name]: data,
      toggle: toggleClass(class_name),
    });
  }

  getByTown(town) {
    const creature_names = ['marksman', 'griffin', 'angel'];
    const creatures = creature_names.map(name => <Creature key={name} name={name} onClick={this.handleCreatureClick}/>);
    return <div>{creatures}</div>
  }

  render() {
    return (
      <div className={style.calc}>
        <div className={style.attacking}>
          <h3>{TITLES.attacking}</h3>
          {this.renderInput('attacking', TITLES.name)}
          {this.renderInput('attacking', TITLES.amount)}
          {this.renderInput('attacking', TITLES.additional_attack)}
          {this.renderInput('attacking', TITLES.level)}
          {this.renderInput('attacking', TITLES.attack)}
          {this.renderInput('attacking', TITLES.defense)}
          {this.renderInput('attacking', TITLES.min_damage)}
          {this.renderInput('attacking', TITLES.max_damage)}
          {this.renderInput('attacking', TITLES.health)}
          {this.renderInput('attacking', TITLES.speed)}
          {this.renderInput('attacking', TITLES.growth)}
          {this.renderInput('attacking', TITLES.value)}
          {this.renderInput('attacking', TITLES.cost)}
        </div>
        <div className={style.defending}>
          <h3>{TITLES.defending}</h3>
          {this.renderInput('defending', TITLES.name)}
          {this.renderInput('defending', TITLES.amount)}
          {this.renderInput('defending', TITLES.additional_defense)}
          {this.renderInput('defending', TITLES.level)}
          {this.renderInput('defending', TITLES.attack)}
          {this.renderInput('defending', TITLES.defense)}
          {this.renderInput('defending', TITLES.min_damage)}
          {this.renderInput('defending', TITLES.max_damage)}
          {this.renderInput('defending', TITLES.health)}
          {this.renderInput('defending', TITLES.speed)}
          {this.renderInput('defending', TITLES.growth)}
          {this.renderInput('defending', TITLES.value)}
          {this.renderInput('defending', TITLES.cost)}
        </div>
        <div className={style.result}>
          <CalcResult min={calcMin(this.state.attacking, this.state.defending)}
                      max={calcMax(this.state.attacking, this.state.defending)}
                      totalHealth={totalHealth(this.state.defending)}/>
        </div>
        <div className={style.creatures}>
          Castle<br/>
          {this.getByTown('Castle')}
          <br/>Rampart<br/>
          <Creature name="grand_elf" onClick={this.handleCreatureClick}/>
          <Creature name="unicorn" onClick={this.handleCreatureClick}/>
          <Creature name="green_dragon" onClick={this.handleCreatureClick}/>
          <br/>Tower<br/>
          <Creature name="iron_golem" onClick={this.handleCreatureClick}/>
          <Creature name="giant" onClick={this.handleCreatureClick}/>
          <br/>Inferno<br/>
          <Creature name="magog" onClick={this.handleCreatureClick}/>
          <Creature name="efreet_sultan" onClick={this.handleCreatureClick}/>
          <br/>Necropolis<br/>
          <Creature name="skeleton" onClick={this.handleCreatureClick}/>
          <Creature name="vampire_lord" onClick={this.handleCreatureClick}/>
          <Creature name="lich" onClick={this.handleCreatureClick}/>
          <Creature name="dread_knight" onClick={this.handleCreatureClick}/>
          <Creature name="bone_dragon" onClick={this.handleCreatureClick}/>
          <br/>Dungeon<br/>
          <Creature name="infernal_troglodyte" onClick={this.handleCreatureClick}/>
          <Creature name="minotaur_king" onClick={this.handleCreatureClick}/>
          <br/>Stronghold<br/>
          <Creature name="wolf_raider" onClick={this.handleCreatureClick}/>
          <Creature name="orc" onClick={this.handleCreatureClick}/>
          <Creature name="roc" onClick={this.handleCreatureClick}/>
          <Creature name="thunderbird" onClick={this.handleCreatureClick}/>
          <Creature name="cyclops" onClick={this.handleCreatureClick}/>
          <br/>Fortress<br/>
          <Creature name="gnoll_marauder" onClick={this.handleCreatureClick}/>
          <Creature name="lizard_warrior" onClick={this.handleCreatureClick}/>
          <Creature name="dragon_fly" onClick={this.handleCreatureClick}/>
          <Creature name="wyvern" onClick={this.handleCreatureClick}/>
          <Creature name="wyvern_monarch" onClick={this.handleCreatureClick}/>
          <br/>Conflux<br/>
          <Creature name="pixie" onClick={this.handleCreatureClick}/>
          <Creature name="water_elemental" onClick={this.handleCreatureClick}/>
          <Creature name="fire_elemental" onClick={this.handleCreatureClick}/>
          <br/>Cove<br/>
          <Creature name="nix_warrior" onClick={this.handleCreatureClick}/>
          <br/>Neutral<br/>
          <Creature name="nomad" onClick={this.handleCreatureClick}/>
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
