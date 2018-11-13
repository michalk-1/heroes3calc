import React from 'react';
import style from './Creatures.css';
import { Creature } from '../Creature/index.js';
import { TOWNS } from '../../data.js';

export class Creatures extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreatureClick = this.handleCreatureClick.bind(this);
    this.by_town = {};
    let creatures = this;
    TOWNS.forEach(function(town){
      const uri = "http://localhost:5000/d/list_of_creatures?town=" + town;
      fetch(uri)
        .then(res => res.json())
        .then(
          (result) => {
            creatures.by_town[town] = result['uri'];
            creatures.forceUpdate();
          },
          (error) => {
            console.log(error);
          }
        )
    });
  }

  getCreature(record) {
    if (!this.by_town.hasOwnProperty(record.town)) {
      return {};
    }

    const matching = this.by_town[record.town].filter(
      x => x.name === record.name
    );

    if (matching.length != 1) {
      return {};
    }

    return matching[0];

  }

  handleCreatureClick(creature_name, town) {
    const creature = this.getCreature({
      name: creature_name, town: town
    });
    this.props.onClick(creature);
  }

  getByTown(town) {
    if (!this.by_town.hasOwnProperty(town)) {
      return <div></div>
    }

    const creatures = this.by_town[town].map(record => (
      <Creature key={record.name} name={record.name} image={record.image}
                town={town} onClick={this.handleCreatureClick}/>
    ));
    return <div>{creatures}</div>
  }

  render() {
    return (
      <div className={style.creatures}>
        Castle<br/>
        {this.getByTown('Castle')}
        <br/>Rampart<br/>
        {this.getByTown('Rampart')}
        <br/>Tower<br/>
        {this.getByTown('Tower')}
        <br/>Inferno<br/>
        {this.getByTown('Inferno')}
        <br/>Necropolis<br/>
        {this.getByTown('Necropolis')}
        <br/>Dungeon<br/>
        {this.getByTown('Dungeon')}
        <br/>Stronghold<br/>
        {this.getByTown('Stronghold')}
        <br/>Fortress<br/>
        {this.getByTown('Fortress')}
        <br/>Conflux<br/>
        {this.getByTown('Conflux')}
        <br/>Cove<br/>
        {this.getByTown('Cove')}
        <br/>Neutral<br/>
        {this.getByTown('Neutral')}
      </div>
    );
  }
};
