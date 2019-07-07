import React, { Component } from 'react';
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
  const abbr = item.get('abbr');
  return (
    <div className={`${style.item} ${isHighlighted ? style.highlighted : ''}`}
         key={abbr}
    >
      {name}
    </div>
  );
}

export class Dropdown extends Component {


  render() {
    return (
      <div>
        <Autocomplete
          value={this.props.value}
          inputProps={{ id: 'states-autocomplete' }}
          wrapperStyle={{ display: 'block' }}
          items={Object.values(this.props.creature_data.by_name)}
          getItemValue={(item) => item.get('name')}
          shouldItemRender={matchStateToTerm}
          sortItems={sortStates}
          onChange={(ev, value) => this.props.onChange(value)}
          onSelect={value => this.props.onChange(value)}
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
}