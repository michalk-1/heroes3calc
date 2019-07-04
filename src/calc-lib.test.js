import {calcLosses, calcTotalHealth} from './calc-lib.js';
import {PMap} from './immutable-lib.js';

describe('calcTotalHealth', () => {
  it('multiplies health by amount', () => {
    const army = PMap({health: 3, amount: 4});
    const result = calcTotalHealth(army);
    expect(result.get('health')).toEqual(3);
    expect(result.get('amount')).toEqual(4);
    expect(result.get('total_health')).toEqual(12);
  });
  it('Returns zero if provided with NaN', () => {
    const army = PMap({health: NaN, amount: NaN});
    const result = calcTotalHealth(army);
    expect(result.get('total_health')).toEqual(0);
  });
  it('accepts numbers as strings and parses them', () => {
    const army = PMap({health: '3', amount: '4'});
    expect(army.get('health')).toEqual('3');
    const result = calcTotalHealth(army);
    expect(result.get('health')).toEqual(3);
    expect(result.get('amount')).toEqual(4);
    expect(result.get('total_health')).toEqual(12);
  });
});

describe('calcLosses', () => {
  const damage = PMap({
    minimum: 3,
    maximum: 6,
  });

  it('calculates losses', () => {
    const army = PMap({health: 3, amount: 4, total_health: 12});
    const result = calcLosses(army, damage);
    const minimum_losses = result.getIn(['losses', 'minimum']);
    const maximum_losses = result.getIn(['losses', 'maximum']);
    const minimum_remain = result.getIn(['remaining', 'minimum']);
    const maximum_remain = result.getIn(['remaining', 'maximum']);

    expect(minimum_losses).toEqual(1);
    expect(maximum_remain).toEqual(3);

    expect(minimum_remain).toEqual(2);
    expect(maximum_losses).toEqual(2);
  });
  it('calculates losses returns zero on NaN', () => {
    const army = PMap({health: NaN, amount: NaN});
    const result = calcLosses(army, damage);
    const minimum_losses = result.getIn(['losses', 'minimum']);
    const maximum_losses = result.getIn(['losses', 'maximum']);
    expect(minimum_losses).toEqual(0);
    expect(maximum_losses).toEqual(0);
  });
});
