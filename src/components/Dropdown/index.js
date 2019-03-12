import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import style from './Dropdown.css';


function sortStates(a, b, value) {
  const aLower = a.name.toLowerCase()
  const bLower = b.name.toLowerCase()
  const valueLower = value.toLowerCase()
  const queryPosA = aLower.indexOf(valueLower)
  const queryPosB = bLower.indexOf(valueLower)
  if (queryPosA !== queryPosB) {
    return queryPosA - queryPosB
  }
  return aLower < bLower ? -1 : 1
}

function matchStateToTerm(state, value) {
  return (
    state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  )
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
          getItemValue={(item) => item.name}
          shouldItemRender={matchStateToTerm}
          sortItems={sortStates}
          onChange={(ev, value) => this.props.onChange(value)}
          onSelect={value => this.props.onChange(value)}
          renderMenu={children => (
            <div className="menu">
              {children}
            </div>
          )}
          renderItem={(item, isHighlighted) => (
            <div
              className={`${style.item} ${isHighlighted ? style.highlighted : ''}`}
              key={item.abbr}
            >{item.name}</div>
          )}
        />
      </div>
    );
  }
}