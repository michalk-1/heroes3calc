import {memoize, PMap} from "./immutable-lib";
import {Seq} from 'immutable';
import {NUMBER_NAMES, STRING_NAMES} from "./data";

export function emptyForm() {
  let entries = Seq(NUMBER_NAMES.map(x => [x, 0]));
  entries = entries.concat([['amount', 1]]);
  entries = entries.concat(STRING_NAMES.map(x => [x, '']));
  return PMap(entries);
}
emptyForm = memoize(emptyForm);


export function stateUpdate(attacking, defending) {
  verify(attacking, 'stateUpdate.attacking', Map.isMap);
  verify(defending, 'stateUpdate.defending', Map.isMap);

  attacking = attacking.set('damage', calcAverage(PMap({
    minimum: calcMin(attacking, defending),
    maximum: calcMax(attacking, defending),
  })));

  defending = calcTotalHealth(defending);
  defending = calcLosses(defending, attacking.get('damage'));

  defending = defending.set('damage', calcAverage(PMap({
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
stateUpdate = memoize(stateUpdate);


// attacking: attacking,
// minimum_damage: attacking.getIn(['damage', 'minimum']),
// average_damage: attacking.getIn(['damage', 'average']),
// maximum_damage: attacking.getIn(['damage', 'maximum']),
// minimum_losses: attacking.getIn(['losses', 'minimum']),
// average_losses: attacking.getIn(['losses', 'average']),
// maximum_losses: attacking.getIn(['losses', 'maximum']),
// minimum_units_left: attacking.getIn(['remaining', 'minimum']),
// average_units_left: attacking.getIn(['remaining', 'average']),
// maximum_units_left: attacking.getIn(['remaining', 'maximum']),
// defending: defending,
// defending_minimum_damage: defending.getIn(['damage', 'minimum']),
// defending_average_damage: defending.getIn(['damage', 'average']),
// defending_maximum_damage: defending.getIn(['damage', 'maximum']),
// defending_minimum_losses: defending.getIn(['losses', 'minimum']),
// defending_average_losses: defending.getIn(['losses', 'average']),
// defending_maximum_losses: defending.getIn(['losses', 'maximum']),
// defending_minimum_units_left: defending.getIn(['remaining', 'minimum']),
// defending_average_units_left: defending.getIn(['remaining', 'average']),
// defending_maximum_units_left: defending.getIn(['remaining', 'maximum']),

