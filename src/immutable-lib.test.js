import {memoize, PList, PMap, isImmutable} from './immutable-lib.js';
import Immutable from 'immutable';
import deepEqual from 'deep-equal';

test('deepEqual compares deep structure', () => {
  const xs_1 = Immutable.List([1, 2]);
  const xs_2 = Immutable.List([1, 2]);
  const mut1 = [1, 2];
  const mut2 = [1, 2];

  expect(xs_1).not.toBe(xs_2);
  expect(xs_1).toEqual(xs_2);
  expect(deepEqual(xs_1, xs_2)).toBe(true);
  expect(Immutable.is(xs_1, xs_2)).toBe(true);
  expect(Immutable.is(xs_1, xs_2)).toBe(true);

  expect(deepEqual(mut1, mut2)).toBe(true);
  expect(Immutable.is(mut1, mut2)).toBe(false);  // not true and not an error either
  expect(Immutable.is("1, 2", "1, 2")).toBe(true);

  expect(deepEqual(xs_1, mut1)).toBe(false);  // not true
});

describe('Immutable', () => {
  it('can be accessed via get item syntax only', () => {
    expect(Immutable.List([1, 2]).get(0)).toEqual(1);
    expect(Immutable.List([1, 2])[0]).toBe(undefined);
    expect(Immutable.Map({a: 2}).get('a')).toEqual(2);
    expect(Immutable.Map({a: 2})['a']).toBe(undefined);
  });
  it('can use referential transparency for hashtable lookup', () => {
    let obj1 = Immutable.List([1, 2, 3]);
    let obj2 = Immutable.List([1, 2, 3]);
    let elements = PList(obj1);
    let elementsPlus = PList.push(elements, 4);
    let elementsPlus2 = PList.push(elements, 4);
    let sameElements = PList(obj2);

    expect(elements).toEqual(sameElements);
    expect(elements).toEqual(Immutable.List([1, 2, 3]));
    expect(PList.name).toEqual("PList");
    expect(elementsPlus).toEqual(elements.push(4));
    expect(elementsPlus).toBe(elementsPlus2);
    expect(elements).toBe(sameElements);
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
    const obj1a = PMap({obj: 1});
    const obj1b = PMap({obj: 1});
    const obj2 = PMap({obj: 2});

    expect(obj1a).not.toBe(obj2);
    expect(obj1a).not.toEqual(obj2);
    expect(obj1a).toBe(obj1b);
  });
});
