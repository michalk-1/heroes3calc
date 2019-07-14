import React from 'react';
import style from './Creatures.css';
import { Creature } from '../Creature/index.js';
import { TOWNS, SKELETON, SKELETON_WARRIOR } from '../../data.js';
import Immutable from 'immutable';

const Map = Immutable.Map;
const List = Immutable.List;

export class CreatureData {
  constructor(owner) {
    const skeleton = Map(SKELETON);
    const skeleton_warrior = Map(SKELETON_WARRIOR);
    this.by_town = Map({[SKELETON['town']]: List([skeleton, skeleton_warrior])});
    this.by_name = Map({[SKELETON['name']]: skeleton, [SKELETON_WARRIOR['name']]: skeleton_warrior});
    let that = this;
    TOWNS.forEach(town => {
      const uri = window.location.origin + '/d/list_of_creatures?town=' + town;
      fetch(uri)
        .then(response => response.json())
        .then(
          (json_response) => {
            const list_of_creatures = Immutable.fromJS(json_response['uri']);
            that.by_town = that.by_town.set(town, list_of_creatures);
            list_of_creatures.forEach(creature => {
              that.by_name = that.by_name.set(creature.get('name'), creature);
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
      return Map();
    }

    const name = record.name;

    if (record.hasOwnProperty('town')) {
      const town = record.town;
      return this.getCreatureFromTown(town, name);
    }

    return this.getCreatureByName(name);
  }

  getCreatureByName(name) {
    return this.by_name.get(name);
  }

  getCreatureFromTown(town, name) {
    if (!this.hasTown(town)) {
      return Map();
    }

    const result_opt = this.by_town.get(town).find(
      x => x.get('name') === name
    );

    if (result_opt === undefined) {
      return {};
    }

    return result_opt;
  }

  hasCreature(name) {
    return this.by_name.has(name);
  }

  hasTown(town) {
    return this.by_town.has(town);
  }

  getTown(town) {
    return this.by_town.get(town);
  }
}

export class Creatures extends React.Component {

  constructor(props) {
    super(props);
    this.creature_data = this.props.creature_data;
  }

  handleCreatureClick(name) {
    const creature = this.creature_data.getCreature({name: name});
    this.props.onClick(creature);
  }

  getCreaturesFromTown(town) {
    if (!this.creature_data.hasTown(town)) {
      return <div></div>;
    }

    const creatures = this.creature_data.getTown(town).map(record => {
      const name = record.get('name');
      const image = record.get('image');
      return (
        <Creature key={name} name={name} image={image} town={town}
                  onClick={name => this.handleCreatureClick(name)}/>
      );
    });

    return <div>{creatures}</div>;
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
