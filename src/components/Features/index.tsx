import React from 'react';
import style from './Features.css';
import { CalcInput, CreatureDropdown, ButtonInput } from '../CalcInput/index';
import { FEATURE_TYPES, TITLES } from './../../data';
import { parseType } from  './../../util';

type FeaturesProps = {
  creature_data: any,
  features_type: any,
  values: any,
  onInputChange: (features_type: string, name: string, parsed_value: any) => void,
  onButtonClick: (field_name: string) => void,
  onCreatureChange: (features_type: string, creature: any) => void,
};

export class Features extends React.Component<FeaturesProps, {}> {

  constructor(props) {
    super(props);
    this.state = {};
    this.onInputChange = this.onInputChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  onInputChange(name, value) {
    const props = this.props;
    const features_type = props.features_type;
    const previous_value = this.state[name];
    const parsed_value = parseType(name, value, previous_value);
    props.onInputChange(features_type, name, parsed_value);
    this.setState({[name]: parsed_value});
  }

  onCreatureChange({creature_name}) {
    const props = this.props;
    const features_type = props.features_type;
    const creature_data = props.creature_data;
    const has_creature = creature_data ? creature_data.hasCreature(creature_name) : false;
    if (has_creature) {
      const creature = creature_data.getCreature({name: creature_name});
      props.onCreatureChange(features_type, creature);
    }
  }

  onNameChange(name, value) {
    this.onInputChange(name, value);
    this.onCreatureChange({creature_name: value});
  }

  render() {
    const props = this.props;
    const features_type = props.features_type;
    const onNameChange = this.onNameChange;
    const values = props.values;
    const creature_data = props.creature_data;
    const dropdown_props = {creature_data: creature_data, values: values, onChange: onNameChange};
    const onInputChange = this.onInputChange;
    const input_props = {values: values, onChange: onInputChange};
    const state_style = style.inactive;
    const is_attacking = features_type === FEATURE_TYPES.attacking;
    const onButtonClick = props.onButtonClick;
    return (
      <div className={`${state_style} ${style.features}`}>
        <CreatureDropdown title={TITLES.name} {...dropdown_props}/>
        <CalcInput title={TITLES.health} {...input_props}/>
        {is_attacking
         ? <ButtonInput title={TITLES.amount} onClick={onButtonClick} {...input_props}/>
         : <CalcInput title={TITLES.amount} {...input_props}/>}
        {is_attacking
         ? <ButtonInput
             title={TITLES.additional_attack}
             onClick={onButtonClick}
             {...input_props}
           />
         : <CalcInput title={TITLES.additional_attack} {...input_props}/>}
        <CalcInput title={TITLES.additional_defense} {...input_props}/>
        <CalcInput title={TITLES.damage_reduction} {...input_props}/>
        <CalcInput title={TITLES.speed} {...input_props}/>
        <CalcInput title={TITLES.attack} {...input_props}/>
        <CalcInput title={TITLES.defense} {...input_props}/>
        <CalcInput title={TITLES.minimum_damage} {...input_props}/>
        <CalcInput title={TITLES.maximum_damage} {...input_props}/>
        <CalcInput title={TITLES.special} {...input_props}/>
      </div>
    );
  }
}
