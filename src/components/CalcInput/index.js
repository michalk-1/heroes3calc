import React from 'react';
import { Dropdown } from '../Dropdown/index.js';
import { NAMES } from './../../data.js';
import tooltip_style from './Tooltip.css';

export function CalcInput({title, values, onChange}) {
  const name = NAMES[title];
  const value = values.get(name);
  return (
    <div>
      <span>{title}: </span>
      <input
        value={value}
        onChange={ev => onChange(name, ev.target.value)}
      />
    </div>
  );
}

export function CreatureDropdown({title, values, creature_data, onChange}) {
  const name = NAMES[title];
  const value = values.get(name);
  const onValueChange = (x) => onChange(name, x);
  return (
    <div>
      <span>{title}: </span>
      <Dropdown value={value} creature_data={creature_data} onChange={onValueChange}/>
    </div>
  );
}

export function ButtonInput({title, values, onChange, onClick}) {
  const name = NAMES[title];
  const gap_percent = 1;
  const button_width = 10;
  const value = values.get(name);
  return (
    <div>
      <span>{title}: </span>
      <div>
        <input
          value={value}
          onChange={ev => onChange(name, ev.target.value)}
          style={{
            display: 'inline-block',
            width: `${100 - button_width - gap_percent}%`,
          }}
        />
        <div style={{
          display: 'inline-block',
          width: `${button_width}%`,
          float: 'right',
        }} className={tooltip_style.tooltip}>
          <button onClick={() => onClick(name)} style={{textAlign: 'center', padding: 0}}>
            ↺
          </button>
          <span className={tooltip_style.tooltiptext}>
            Find a value for which this creature wins with minimal losses.
          </span>
        </div>
      </div>
    </div>
  );
}