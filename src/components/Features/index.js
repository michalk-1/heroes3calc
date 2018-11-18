import React from 'react';
import { NAMES, NUMBER_NAMES, TITLES } from './../../data.js';
import style from './Features.css';
import { CalcInput } from '../CalcInput/index.js';

export class Features extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  renderInput(title) {
    const name = NAMES[title];
    return (
      <div>
        <span>{title}: </span>
        <CalcInput value={this.props.values[name]}
                   onChange={(ev) => this.handleInputChange(name, ev.target.value)}/>
      </div>
    );
  }

  handleInputChange(name, value) {
    this.props.onInputChange(this.props.type, name, value);
  }

  handleClick() {
    this.props.onClick(this.props.type);
  }

  render() {
    let current_style = this.props.active ? style.active : style.inactive;
    current_style += ' ' + style.features;
    return (
      <div className={current_style} onClick={this.handleClick}>
        {this.renderInput(TITLES.name)}
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
