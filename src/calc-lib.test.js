import { calcTotalHealth } from './calc-lib.js';

describe('calcTotalHealth', () => {
  it('multiplies health by amount', () => {
    expect(calcTotalHealth({health: 3, amount: 4})).toEqual(12);
  });
  it('throws a TypeError if provided with NaN', () => {
    expect(() => calcTotalHealth({health: NaN, amount: NaN})).toThrow(TypeError);
  });
});
