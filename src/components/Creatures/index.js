import React from 'react';
import style from './Creatures.css';
import { CreatureBank } from '../CreatureBank/index.js';
import { TOWNS, SKELETON, SKELETON_WARRIOR } from '../../data.js';
import Immutable from 'immutable';

const List = Immutable.List;

function listBanksUri() {
  const uri = `${window.location.origin}/d/banks`;
  return uri;
}

export function asyncGetBanks(creatures_by_name_promise) {
  const banks_promise = fetch(listBanksUri())
    .then(raw_response => raw_response.json())
    .then(response => Immutable.fromJS(response['banks']),
          error => { console.log(error); });
  return Promise.all([banks_promise, creatures_by_name_promise]).then(results => {
    const [banks, creatures] = results;
    const enhancedGuard = (guard) => {
      const name = guard.get('name');
      guard = guard.remove('name');
      guard = guard.set('creature', creatures.get(name));
      return guard;
    };
    const enhanceBank = (bank) => {
       const levels = bank.get('levels');
       const bank_1 = bank.set('levels', levels.withMutations(mutable_levels => {
        for (let i = 0; i < mutable_levels.size; i++) {
          const level = mutable_levels.get(i);
          const guards = level.get('guards')
          const enhanced_level  = level.set('guards', guards.map(enhancedGuard));
          mutable_levels.set(i, enhanced_level);
        }
       }));
       return bank_1;
    };
    return banks.map(enhanceBank);
  });
}

function listTownCreaturesUri(town) {
  const uri = window.location.origin + '/d/list_of_creatures?town=' + town;
  return uri;
}

export function asyncGetCreatureData() {
    return Promise.all(TOWNS.map((town) => {
      const uri = listTownCreaturesUri(town);
      return fetch(uri)
        .then(response => response.json())
        .then(json_response => List([town, Immutable.fromJS(json_response['uri'])]),
              error => console.log(error))
    })).then(
      (town_and_creatures_list) => {
        town_and_creatures_list = List(town_and_creatures_list);
        const by_town = Immutable.Map(town_and_creatures_list);
        const by_name_items = town_and_creatures_list.flatMap((town_and_creatures) => {
          const creatures = town_and_creatures.get(1);
          return creatures.map(creature => List([creature.get('name'), creature]));
        });
        const by_name = Immutable.Map(by_name_items);
        return new CreatureData({by_town: by_town, by_name: by_name});
      },
      error => console.log(error)
    )
}

class CreatureData {
  constructor(creatures_data) {
    this.by_town = creatures_data.by_town;
    this.by_name = creatures_data.by_name;
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

  render() {
    const props = this.props;
    const onGuardClick = props.onGuardClick;
    const banks = props.banks;
    return (
      <div className={style.creatures}>
        {banks.map(
          (bank, i) => <div id={`bank_${i}`}><CreatureBank bank={bank} onGuardClick={onGuardClick}/></div>
        )}
      </div>
    );
  }
}
