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
    const result = calcTotalHealth(army);
    expect(result.get('health')).not.toEqual('3');
    expect(result.get('amount')).not.toEqual('4');
    expect(result.get('health')).toEqual(3);
    expect(result.get('amount')).toEqual(4);
    expect(result.get('total_health')).toEqual(12);
  });
});

describe('calcLosses', () => {
  it('calculates losses', () => {
    const army = PMap({health: '3', amount: '4'});
    const result = calcLosses(army, '3');
    expect(result.get('losses')).toEqual(1);
  });
  it('calculates losses returns zero on NaN', () => {
    const army = PMap({health: NaN, amount: NaN});
    const result = calcLosses(army, NaN);
    expect(result.get('losses')).toEqual(0);
  });
});
