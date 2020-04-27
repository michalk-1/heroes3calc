import {Seq, Map} from 'immutable';
import {NUMBER_NAMES, STRING_NAMES} from "./data";
import {calcAverage, calcLosses, calcMax, calcMin, calcTotalHealth} from "./calc-lib";

export type Features = any;

export function emptyForm() {
  const entries = Seq(NUMBER_NAMES.map(x => [x, 0]));
  const entries_1 = entries.concat([['amount', 1]]);
  const entries_2: any = entries_1.concat(STRING_NAMES.map(x => [x, '']));
  return Map(entries_2);
}

export function stateUpdate(attacking: Features, defending: Features) {
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

  return Object.freeze({
    attacking: attacking,
    defending: defending,
  });
}

export default {
  stateUpdate: stateUpdate,
  emptyForm: emptyForm,
};
