import {calcTotalHealth} from './calc-lib.js';
import {PMap} from './immutable-lib.js';

describe('calcTotalHealth', () => {
  it('multiplies health by amount', () => {
    const army = PMap({health: 3, amount: 4});
    const result = calcTotalHealth(army);
    expect(result.get('health')).toEqual(3);
    expect(result.get('amount')).toEqual(4);
    expect(result.get('total_health')).toEqual(12);
  });
  it('throws a TypeError if provided with NaN', () => {
    const army_nan = PMap({health: NaN, amount: NaN});
    expect(() => calcTotalHealth(army_nan)).toThrow(TypeError);
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

