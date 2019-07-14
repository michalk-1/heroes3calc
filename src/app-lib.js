import {Seq, Map} from 'immutable';
import {NUMBER_NAMES, STRING_NAMES} from "./data";
import {calcAverage, calcLosses, calcMax, calcMin, calcTotalHealth} from "./calc-lib";

export function emptyForm() {
  let entries = Seq(NUMBER_NAMES.map(x => [x, 0]));
  entries = entries.concat([['amount', 1]]);
  entries = entries.concat(STRING_NAMES.map(x => [x, '']));
  return Map(entries);
}

export function stateUpdate(attacking, defending) {

  attacking = attacking.set('damage', calcAverage(Map({
    minimum: calcMin(attacking, defending),
    maximum: calcMax(attacking, defending),
  })));

  defending = calcTotalHealth(defending);
  defending = calcLosses(defending, attacking.get('damage'));

  defending = defending.set('damage', calcAverage(Map({
    minimum: calcMin(defending.set('amount', defending.getIn(['remaining', 'minimum'])), attacking),
    maximum: calcMax(defending.set('amount', defending.getIn(['remaining', 'maximum'])), attacking),
  })));

  attacking = calcTotalHealth(attacking);
  attacking = calcLosses(attacking, defending.get('damage'));

  return {
    attacking: attacking,
    defending: defending,
  };
}

export function merge(x, y) {
  return x.merge(y);
}

export default {
  merge: merge,
  stateUpdate: stateUpdate,
  emptyForm: emptyForm,
};
