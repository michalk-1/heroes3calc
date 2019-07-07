import React from 'react';
import style from './Creatures.css';
import { Creature } from '../Creature/index.js';
import { TOWNS, SKELETON, SKELETON_WARRIOR } from '../../data.js';
import { PMap } from "../../immutable-lib";

export class CreatureData {
  constructor(owner) {
    const skeleton = PMap(SKELETON);
    const skeleton_warrior = PMap(SKELETON_WARRIOR);
    this.by_town = {[SKELETON['town']]: [skeleton, skeleton_warrior]};
    this.by_name = {[SKELETON['name']]: skeleton,
                    [SKELETON_WARRIOR['name']]: skeleton_warrior};
    let that = this;
    TOWNS.forEach(town => {
      const uri = window.location.origin + '/d/list_of_creatures?town=' + town;
      fetch(uri)
        .then(response => response.json())
        .then(
          (json_response) => {
            const list_of_objects = json_response['uri'];
            const list_of_pmaps = list_of_objects.map(x => PMap(x));
            that.by_town[town] = list_of_pmaps;
            list_of_pmaps.forEach(creature => {
              that.by_name[creature.get('name')] = creature;
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

    const result_opt = this.by_town[town].find(
      x => x.get('name') === name
    );

    if (result_opt === undefined) {
      return {};
    }

    return result_opt;
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
