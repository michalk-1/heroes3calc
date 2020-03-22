import React from 'react';
import style from './Features.css';
import { CalcInput, CreatureDropdown, ButtonInput } from '../CalcInput/index.js';
import { FEATURE_TYPES, TITLES } from './../../data.js';
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
    const onNameChange = this.onNameChange;
    const values = props.values;
    const creature_data = props.creature_data;
    const dropdown_props = {creature_data: creature_data, values: values, onChange: onNameChange};
    const onInputChange = this.onInputChange;
    const input_props = {values: values, onChange: onInputChange};
    const state_style = props.active ? style.active : style.inactive;
    const is_attacking = props.type === FEATURE_TYPES.attacking;
    return (
      <div className={`${state_style} ${style.features}`} onClick={() => this.onClick()}>
        <CreatureDropdown title={TITLES.name} {...dropdown_props}/>
        <CalcInput title={TITLES.speed} {...input_props}/>
        <CalcInput title={TITLES.health} {...input_props}/>
        {is_attacking
         ? <ButtonInput title={TITLES.amount} {...input_props}/>
         : <CalcInput title={TITLES.amount} {...input_props}/>}
        {is_attacking
         ? <ButtonInput title={TITLES.additional_attack} {...input_props}/>
         : <CalcInput title={TITLES.additional_attack} {...input_props}/>}
        <CalcInput title={TITLES.additional_defense} {...input_props}/>
        <CalcInput title={TITLES.damage_reduction} {...input_props}/>
        <CalcInput title={TITLES.attack} {...input_props}/>
        <CalcInput title={TITLES.defense} {...input_props}/>
        <CalcInput title={TITLES.minimum_damage} {...input_props}/>
        <CalcInput title={TITLES.maximum_damage} {...input_props}/>
        <CalcInput title={TITLES.special} {...input_props}/>
      </div>
    );
  }
}
