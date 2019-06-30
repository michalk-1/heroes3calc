import {memoize, PList, PMap, isImmutable} from './immutable-lib.js';
import Immutable from 'immutable';
import deepEqual from 'deep-equal';

test('deepEqual compares deep structure', () => {
  expect(deepEqual([1, 2], [1, 2])).toBe(true);
  expect([1, 2, 3]).toEqual(Immutable.List([1, 2, 3]));  // TODO: even this does not work
  expect(deepEqual(Immutable.List([1, 2]), [1, 2])).toBe(false);  // TODO: reimplement deepEqual
});

describe('Immutable', () => {
  it('can be accessed via get item syntax only', () => {
    expect(Immutable.List([1, 2]).get(0)).toEqual(1);
    expect(Immutable.List([1, 2])[0]).toBe(undefined);
    expect(Immutable.Map({a: 2}).get('a')).toEqual(2);
    expect(Immutable.Map({a: 2})['a']).toBe(undefined);
  });
  it('can use referential transparency for hashtable lookup', () => {
    let obj1 = [1, 2, 3];
    let obj2 = [1, 2, 3];
    let elements = PList(obj1);
    let elementsPlus = PList.push(elements, 4);
    let elementsPlus2 = PList.push(elements, 4);
    let sameElements = PList(obj2);

    expect(elements).toEqual(sameElements);
    expect(elements).toEqual(Immutable.List([1, 2, 3]));
    expect(PList.name).toEqual(Immutable.List.name);
    expect(elementsPlus).toEqual(elements.push(4));
    expect(elementsPlus).toBe(elementsPlus2);  // todo: should be same thing
    expect(elements).toBe(sameElements);  // todo: must cast mutable arguments to immutable ones
  });
  it('can cache empty function call', () => {
    const fn = () => ({});
    const fnMemoized = memoize(fn);
    const obj = fnMemoized();
    expect(fn()).not.toBe(obj);
    expect(fnMemoized()).toBe(obj);
  });
  it('can cache multi argument function call', () => {
    const fn = (a, b) => ({'a': a, 'b': b});
    const fnMemoized = memoize(fn);
    const obj0 = fnMemoized();
    const obj1 = fnMemoized('a');
    const obj2 = fnMemoized('a', 'b');
    expect(fnMemoized()).toBe(obj0);
    expect(fnMemoized('a')).toBe(obj1);
    expect(fnMemoized('a', 'b')).toBe(obj2);
    expect(fnMemoized()).toEqual(fn());
    expect(fnMemoized('a')).toEqual(fn('a'));
    expect(fnMemoized('a', 'b')).toEqual(fn('a', 'b'));
  });
  it('assertions about Immutable.isImmutable', () => {
    expect(Immutable.isImmutable(undefined)).toBe(false);
    expect(Immutable.isImmutable(null)).toBe(false);
    expect(Immutable.isImmutable(true)).toBe(false);
    expect(Immutable.isImmutable(() => null)).toBe(false);
    expect(Immutable.isImmutable({})).toBe(false);
    expect(Immutable.isImmutable([])).toBe(false);
    expect(Immutable.isImmutable(1)).toBe(false);
    expect(Immutable.isImmutable("1")).toBe(false);
    expect(Immutable.isImmutable(Immutable.Map())).toBe(true);
  });
  it('assertions about isImmutable', () => {
    expect(isImmutable(undefined)).toBe(true);
    expect(isImmutable(null)).toBe(true);
    expect(isImmutable(true)).toBe(true);
    expect(isImmutable(() => null)).toBe(true);
    expect(isImmutable({})).toBe(false);
    expect(isImmutable([])).toBe(false);
    expect(isImmutable(1)).toBe(true);
    expect(isImmutable("1")).toBe(true);
    expect(isImmutable(Immutable.Map())).toBe(true);
  });
  it('uses deep equal to find a key', () => {
    const obj1 = PMap({obj: 1});
    const obj2 = PMap({obj: 2});
    expect(obj1).not.toBe(obj2);
    expect(obj1).not.toEqual(obj2);
  });
});
