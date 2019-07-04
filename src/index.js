import React from 'react';
import ReactDOM from 'react-dom';
import style from './Calc.css';
import {AttackResult} from './components/AttackResult/index.js';
import {RetaliationResult} from './components/RetaliationResult/index.js';
import {CreatureData, Creatures} from './components/Creatures/index.js';
import {Features} from './components/Features/index.js';
import {TITLES} from './data.js';
import {emptyForm, stateUpdate} from "./app-lib";
import {gSimpleCaches} from "./immutable-lib";
window.gSimpleCaches = gSimpleCaches;

class Calc extends React.Component {
  constructor(props) {
    super(props);
    this.creature_data = new CreatureData(this);
    this.state = Object.assign(
      {toggle: 'attacking'},
      stateUpdate(emptyForm(), emptyForm())
    );
  }

  handleSwap() {
    const attacking = this.state.attacking;
    const defending = this.state.defending;
    this.setState(stateUpdate(defending, attacking));
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
    let features = this.state[features_type];
    features = features.set(input_name, parsed_value);
    this.setState(this.dispatchStateUpdate(features, features_type));
  }

  handleCreatureClick(creature) {
    const features_type = this.state.toggle;
    const features = this.state[features_type].merge(creature);
    this.setState(this.dispatchStateUpdate(features, features_type));
  }

  handleFeaturesClick(type) {
    this.setState({toggle: type});
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
        <div className={style.dummy}></div>
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
