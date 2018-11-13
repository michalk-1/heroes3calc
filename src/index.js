import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.css';
import { NUMBER_NAMES, TOWNS, TITLES, NAMES } from './data.js';
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
    this.getByTown = this.getByTown.bind(this);
    this.state = {
      attacking: {
        additional_attack: 0,
        amount: 1,
      },
      defending: {
        additional_defense: 0,
        amount: 1,
      }
    }
    const attacking = getCookie('attacking');
    const defending = getCookie('defending');
    this.state.attacking = Object.assign({}, this.state.attacking, attacking);
    this.state.defending = Object.assign({}, this.state.defending, defending);
    this.state.toggle = 'attacking';
    this.creatures_by_town = {};
    let calc = this;
    TOWNS.forEach(function(town){
      const uri = "http://localhost:5000/d/list_of_creatures?town=" + town;
      fetch(uri)
        .then(res => res.json())
        .then(
          (result) => {
            calc.creatures_by_town[town] = result['uri'];
            calc.forceUpdate();
          },
          (error) => {
            console.log(error);
          }
        )
    });

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
                   onChange={(ev) =>
                    this.handleInputChange(className, name, ev.target.value)}/>
      </div>
    );
  }

  handleInputChange(className, name, value) {
    let state_class = this.state[className];
    const is_number = NUMBER_NAMES.indexOf(name) !== -1;
    state_class[name] = is_number ? Number(value) : value;
    this.setState({[className]: state_class});
  }

  getCreature(record) {
    if (!this.creatures_by_town.hasOwnProperty(record.town)) {
      return {};
    }

    const matching = this.creatures_by_town[record.town].filter(
      x => x.name === record.name
    );

    if (matching.length != 1) {
      return {};
    }

    return matching[0];

  }

  handleCreatureClick(creature_name, town) {
    const class_name = this.state.toggle;
    const creature = this.getCreature({
      name: creature_name, town: town
    });
    console.log(creature);
    const data = Object.assign({}, this.state[class_name], creature);
    setCookie(class_name, data);
    this.setState({
      [class_name]: data,
      toggle: toggleClass(class_name),
    });
  }

  getByTown(town) {
    if (!this.creatures_by_town.hasOwnProperty(town)) {
      return <div></div>
    }

    const creatures = this.creatures_by_town[town].map(record => (
      <Creature key={record.name} name={record.name} image={record.image}
                town={town} onClick={this.handleCreatureClick}/>
    ));
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
          {this.renderInput('attacking', TITLES.minimum_damage)}
          {this.renderInput('attacking', TITLES.maximum_damage)}
          {this.renderInput('attacking', TITLES.health)}
          {this.renderInput('attacking', TITLES.speed)}
          {this.renderInput('attacking', TITLES.growth)}
          {this.renderInput('attacking', TITLES.ai_value)}
          {this.renderInput('attacking', TITLES.cost)}
          {this.renderInput('attacking', TITLES.special)}
        </div>
        <div className={style.defending}>
          <h3>{TITLES.defending}</h3>
          {this.renderInput('defending', TITLES.name)}
          {this.renderInput('defending', TITLES.amount)}
          {this.renderInput('defending', TITLES.additional_defense)}
          {this.renderInput('defending', TITLES.level)}
          {this.renderInput('defending', TITLES.attack)}
          {this.renderInput('defending', TITLES.defense)}
          {this.renderInput('defending', TITLES.minimum_damage)}
          {this.renderInput('defending', TITLES.maximum_damage)}
          {this.renderInput('defending', TITLES.health)}
          {this.renderInput('defending', TITLES.speed)}
          {this.renderInput('defending', TITLES.growth)}
          {this.renderInput('defending', TITLES.ai_value)}
          {this.renderInput('defending', TITLES.cost)}
          {this.renderInput('defending', TITLES.special)}
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
          {this.getByTown('Rampart')}
          <br/>Tower<br/>
          {this.getByTown('Tower')}
          <br/>Inferno<br/>
          {this.getByTown('Inferno')}
          <br/>Necropolis<br/>
          {this.getByTown('Necropolis')}
          <br/>Dungeon<br/>
          {this.getByTown('Dungeon')}
          <br/>Stronghold<br/>
          {this.getByTown('Stronghold')}
          <br/>Fortress<br/>
          {this.getByTown('Fortress')}
          <br/>Conflux<br/>
          {this.getByTown('Conflux')}
          <br/>Cove<br/>
          {this.getByTown('Cove')}
          <br/>Neutral<br/>
          {this.getByTown('Neutral')}
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
