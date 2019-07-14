import React from 'react';
import Autocomplete from 'react-autocomplete';
import style from './Dropdown.css';


function sortStates(a, b, value) {
  const aName = a.get('name');
  const bName = b.get('name');
  const aLower = aName.toLowerCase();
  const bLower = bName.toLowerCase();
  const valueLower = value.toLowerCase();
  const queryPosA = aLower.indexOf(valueLower);
  const queryPosB = bLower.indexOf(valueLower);
  if (queryPosA !== queryPosB) {
    return queryPosA - queryPosB
  }
  return aLower < bLower ? -1 : 1
}

function matchStateToTerm(state, value) {
  const name = state.get('name');
  return name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}

function renderItem(item, isHighlighted) {
  const name = item.get('name');
  const key = name.replace(' ', '_');
  return (
    <div className={`${style.item} ${isHighlighted ? style.highlighted : ''}`}
         key={key}
    >
      {name}
    </div>
  );
}

export function Dropdown(props) {
  const values = Array.from(props.creature_data.by_name.values());
  return (
    <div>
      <Autocomplete
        value={props.value}
        inputProps={{ id: 'states-autocomplete' }}
        wrapperStyle={{ display: 'block' }}
        items={values}
        getItemValue={item => item.get('name')}
        shouldItemRender={matchStateToTerm}
        sortItems={sortStates}
        onChange={(ev, value) => props.onChange(value)}
        onSelect={value => props.onChange(value)}
        renderMenu={children => (
          <div className="menu">
            {children}
          </div>
        )}
        renderItem={renderItem}
      />
    </div>
  );
}
