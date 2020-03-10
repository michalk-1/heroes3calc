import React from 'react';
import style from './Creatures.css';
import { Creature } from '../CreatureBank/index.js';
import { TOWNS, SKELETON, SKELETON_WARRIOR } from '../../data.js';
import Immutable from 'immutable';

const List = Immutable.List;

function listBanksUri() {
  const uri = `${window.location.origin}/d/banks`;
  return uri;
}

export function asyncGetBanks(creatures_by_name_promise) {
  const banks_promise = fetch(listBanksUri)
    .then(raw_response => raw_response.json())
    .then(response => Immutable.fromJS(response['banks']),
          error => { console.log(error); });
  return Promise.all([banks_promise, creatures_by_name_promise], (results) => {
    const [banks, creatures] = results;
    const enhancedGuard = (guard) => {
      const name = guard.get('name');
      guard = guard.remove('name');
      guard = guard.set('creature', creatures.get(name));
      return guard;
    };
    const enhanceBank = (bank) => {
       return bank.set('levels', bank.levels.withMutations(mutable_levels => {
        for (let i = 0; i < mutable_levels.size; i++) {
          const level = mutable_levels[i];
          const guards = level.get('guards')
          const enhanced_level  = level.set('guards', guards.map(enhancedGuard));
          mutable_levels.set(i, enhanced_level);
        }
       }));
    };
    return banks.map(enhanceBank);
  });
}

function listTownCreaturesUri(town) {
  const uri = window.location.origin + '/d/list_of_creatures?town=' + town;
  return uri;
}

export class CreatureData {
  constructor(owner) {
    const skeleton = Immutable.Map(SKELETON);
    const skeleton_warrior = Immutable.Map(SKELETON_WARRIOR);
    this.by_town = Immutable.Map({[SKELETON['town']]: List([skeleton, skeleton_warrior])});
    this.by_name = Immutable.Map({[SKELETON['name']]: skeleton, [SKELETON_WARRIOR['name']]: skeleton_warrior});
    let that = this;
    TOWNS.forEach(town => {
      const uri = listTownCreaturesUri(town);
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
    this.banks = props.banks;
  }

  render() {
    const props = this.props;
    const onGuardClick = props.onGuardClick;
    const banks = this.banks || List();
    return (
      <div className={style.creatures}>
        {banks.map(
          (bank, i) => <div id={`bank_${i}`}><CreatureBank bank={bank} onGuardClick={onGuardClick}/></div>
        )}
      </div>
    );
  }
}
