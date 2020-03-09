import React from 'react';
import style from './Creatures.css';
import { Creature } from '../CreatureBank/index.js';
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

  onGuardClick(guard) {
    const creature_name = guard.getIn(['creature', 'name']);
    const number = guard.get('number');
    const creature = this.creature_data.getCreature({name: creature_name});
    // TODO: figure out the way to propagate the number / amount.
    this.props.onClick(creature);
  }

  getBank(bank_key) {
    const banks = this.banks;
    const bank = banks.get(bank_key);
    return (
        <CreatureBank bank={bank} onGuardClick={this.onGuardClick}/>
    );
  }

  render() {
    return (
      <div className={style.creatures}>
        Dragon Fly Hive<br/>
        {this.getCreaturesFromBank('dragon_fly_hive')}
        <br/>Griffin Conservatory<br/>
        {this.getCreaturesFromBank('griffin_conservatory')}
        <br/>Experimental Shop<br/>
        {this.getCreaturesFromBank('experimental_shop')}
        <br/>Wolf Raider Picket<br/>
        {this.getCreaturesFromBank('wolf_raider_picket')}
        <br/>Red Tower<br/>
        {this.getCreaturesFromBank('red_tower')}
        <br/>Black Tower<br/>
        {this.getCreaturesFromBank('black_tower')}
        <br/>Dwarven Treasury<br/>
        {this.getCreaturesFromBank('dwarven_treasury')}
        <br/>Imp Cache<br/>
        {this.getCreaturesFromBank('imp_cache')}
        <br/>Crypt<br/>
        {this.getCreaturesFromBank('crypt')}
      </div>
    );
  }
}
