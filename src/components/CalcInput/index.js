import React from 'react';
import { Dropdown } from '../Dropdown/index.js';
import { NAMES } from './../../data.js';

export function CalcInput(props) {
  const title = props.title;
  const name = NAMES[title];
  const values = props.values;
  const value = values.get(name);
  const onChange = props.onChange;
  return (
    <div>
      <span>{title}: </span>
      <input value={value} onChange={ev => onChange(name, ev.target.value)}/>
    </div>
  );
}

export function CalcDropdown(props) {
  const data = props.data;
  const values = data.get('values');
  const value = values.get('name')
  const title = props.title;
  const name = NAMES[title];
  const creature_data = data.get('creature_data');
  const onChange = (x) => props.onChange(name, x);
  return (
    <div>
      <span>{title}: </span>
      <Dropdown value={value} creature_data={creature_data} onChange={onChange}/>
    </div>
  );
}