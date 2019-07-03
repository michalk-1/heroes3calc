import React from 'react';
import style from './Creatures.css';
import { Creature } from '../Creature/index.js';
import { TOWNS, SKELETON, SKELETON_WARRIOR } from '../../data.js';
import { parseObject } from '../../util.js';

export class CreatureData {
  constructor(owner) {
    this.by_town = {[SKELETON['town']]: [SKELETON, SKELETON_WARRIOR]};
    this.by_name = {[SKELETON['name']]: SKELETON,
                    [SKELETON_WARRIOR['name']]: SKELETON_WARRIOR};
    let that = this;
    TOWNS.forEach(function(town){
      const uri = window.location.origin + '/d/list_of_creatures?town=' + town;
      fetch(uri)
        .then(response => response.json())
        .then(
          (json_response) => {
            const data = json_response['uri'];
            that.by_town[town] = data;
            data.forEach(function(creature) {
              that.by_name[creature.name] = creature;
            });
            owner.forceUpdate();
          },
          (error) => {
            console.log(error);
          }
        )
    });
  }

  getCreature(record) {
    if (!record.hasOwnProperty('name')) {
      return {};
    }

    if (record.hasOwnProperty('town')) {
      return this.getCreatureFromTown(record.town, record.name);
    }

    return this.getCreatureByName(record.name);
  }

  getCreatureByName(name) {
    return this.by_name[name];
  }

  getCreatureFromTown(town, name) {
    if (!this.hasTown(town)) {
      return {};
    }

    const matching = this.by_town[town].filter(
      x => x.name === name
    );

    if (matching.length !== 1) {
      return {};
    }

    return parseObject(matching[0]);
  }

  hasCreature(name) {
    return this.by_name.hasOwnProperty(name);
  }

  hasTown(town) {
    return this.by_town.hasOwnProperty(town);
  }

  getTown(town) {
    return this.by_town[town];
  }
}

export class Creatures extends React.Component {

  constructor(props) {
    super(props);
    this.creature_data = this.props.creature_data;
  }

  handleCreatureClick(creature_name) {
    const creature = this.creature_data.getCreature({name: creature_name});
    this.props.onClick(creature);
  }

  getCreaturesFromTown(town) {
    if (!this.creature_data.hasTown(town)) {
      return <div></div>
    }

    const creatures = this.creature_data.getTown(town).map(record => (
      <Creature key={record.name} name={record.name} image={record.image}
                town={town} onClick={name => this.handleCreatureClick(name)}/>
    ));
    return <div>{creatures}</div>
  }

  render() {
    return (
      <div className={style.creatures}>
        Castle<br/>
        {this.getCreaturesFromTown('Castle')}
        <br/>Rampart<br/>
        {this.getCreaturesFromTown('Rampart')}
        <br/>Tower<br/>
        {this.getCreaturesFromTown('Tower')}
        <br/>Inferno<br/>
        {this.getCreaturesFromTown('Inferno')}
        <br/>Necropolis<br/>
        {this.getCreaturesFromTown('Necropolis')}
        <br/>Dungeon<br/>
        {this.getCreaturesFromTown('Dungeon')}
        <br/>Stronghold<br/>
        {this.getCreaturesFromTown('Stronghold')}
        <br/>Fortress<br/>
        {this.getCreaturesFromTown('Fortress')}
        <br/>Conflux<br/>
        {this.getCreaturesFromTown('Conflux')}
        <br/>Cove<br/>
        {this.getCreaturesFromTown('Cove')}
        <br/>Neutral<br/>
        {this.getCreaturesFromTown('Neutral')}
      </div>
    );
  }
}
