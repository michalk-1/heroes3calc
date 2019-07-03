import React from 'react';

export function CalcInput(props) {
  return (
    <input onChange={ev => props.onChange(ev.target.value)}
           value={props.value}
    />
  );
}
