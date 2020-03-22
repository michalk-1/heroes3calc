import Immutable from 'immutable';
import React from 'react';
import style from './Features.css';
import { CalcInput, CalcDropdown } from '../CalcInput/index.js';
import { TITLES } from './../../data.js';
import { parseType } from  './../../util.js';

export class Features extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onInputChange = this.onInputChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  onClick() {
    const props = this.props;
    const type = props.type;
    props.onClick(type);
  }

  onInputChange(name, value) {
    const props = this.props;
    const creature_data = props.creature_data;
    const type = props.type;
    const previous_value = this.state[name];
    const parsed_value = parseType(name, value, previous_value);
    props.onInputChange(type, name, parsed_value);
    this.setState({[name]: parsed_value});
  }

  onCreatureChange(creature_name) {
    const props = this.props;
    const creature_data = props.creature_data;
    const has_creature = creature_data ? creature_data.hasCreature(creature_name) : false;
    if (has_creature) {
      const creature = creature_data.getCreature({name: creature_name});
      props.onCreatureChange(creature);
    }
  }

  onNameChange(name, value) {
    const parsed_value = this.onInputChange(name, value);
    this.onCreatureChange(value);
  }

  render() {
    const props = this.props;
    const values = props.values;
    const state_style = this.props.active ? style.active : style.inactive;
    const creature_data = props.creature_data;
    const onInputChange = this.onInputChange;
    const onNameChange = this.onNameChange;
    const data = Immutable.Map({creature_data: creature_data, values: values});
    return (
      <div className={`${state_style} ${style.features}`} onClick={() => this.onClick()}>
        <CalcDropdown title={TITLES.name} data={data} onChange={onNameChange}/>
        <CalcInput title={TITLES.amount} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.health} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.speed} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.attack} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.defense} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.minimum_damage} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.maximum_damage} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.special} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.additional_attack} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.additional_defense} values={values} onChange={onInputChange}/>
        <CalcInput title={TITLES.damage_reduction} values={values} onChange={onInputChange}/>
      </div>
    );
  }
}
