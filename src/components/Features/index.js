import React from 'react';
import { NAMES, TITLES } from './../../data.js';
import style from './Features.css';
import { CalcInput } from '../CalcInput/index.js';
import { parseType } from  './../../util.js';
import { Dropdown } from '../Dropdown/index.js';

export class Features extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {};
  }

  renderInput(title) {
    const name = NAMES[title];
    return (
      <div>
        <span>{title}: </span>
        <CalcInput value={this.props.values[name]}
                   onChange={value => this.handleInputChange(name, value)}/>
      </div>
    );
  }

  renderDropdown(title) {
    const name = NAMES[title];
    return (
      <div>
        <span>{title}: </span>
        <Dropdown value={this.props.values[name]}
                  onChange={value => this.handleInputChange(name, value)}
                  creature_data={this.props.creature_data}
        />
      </div>
    );
  }

  handleInputChange(name, value) {
    const previous_value = this.state[name];
    const parsed_value = parseType(name, value, previous_value);
    this.props.onInputChange(this.props.type, name, parsed_value);
    this.setState({[name]: parsed_value});
    if (name === 'name' && this.props.creature_data.hasCreature(value)) {
      this.handleCreatureChange(value);
    }
    return parsed_value;
  }

  handleCreatureChange(creature_name) {
    const creature = this.props.creature_data.getCreature({name: creature_name});
    this.props.onCreatureChange(creature);
  }

  handleClick() {
    this.props.onClick(this.props.type);
  }

  render() {
    let current_style = this.props.active ? style.active : style.inactive;
    current_style += ' ' + style.features;
    return (
      <div className={current_style} onClick={this.handleClick}>
        {this.renderDropdown(TITLES.name)}
        {this.renderInput(TITLES.amount)}
        {this.renderInput(TITLES.additional_attack)}
        {this.renderInput(TITLES.additional_defense)}
        {this.renderInput(TITLES.damage_reduction)}
        {this.renderInput(TITLES.level)}
        {this.renderInput(TITLES.attack)}
        {this.renderInput(TITLES.defense)}
        {this.renderInput(TITLES.minimum_damage)}
        {this.renderInput(TITLES.maximum_damage)}
        {this.renderInput(TITLES.health)}
        {this.renderInput(TITLES.speed)}
        {this.renderInput(TITLES.growth)}
        {this.renderInput(TITLES.ai_value)}
        {this.renderInput(TITLES.cost)}
        {this.renderInput(TITLES.special)}
      </div>
    );
  }
}
