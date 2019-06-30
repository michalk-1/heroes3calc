import {calcTotalHealth} from './calc-lib.js';
import Immutable from 'seamless-immutable';
import deepEqual from 'deep-equal';

describe('calcTotalHealth', () => {
  it('multiplies health by amount', () => {
    expect(calcTotalHealth({health: 3, amount: 4})).toEqual(12);
  });
  it('throws a TypeError if provided with NaN', () => {
    expect(() => calcTotalHealth({health: NaN, amount: NaN})).toThrow(TypeError);
  });
});

function simpleCache() {
  let _length = 0;
  return {
    create() {
      let store = {};
      return {
        has(key) {
          return store.hasOwnProperty(key);
        },
        get(key) {
          return store[key];
        },
        set(key, value) {
          store[key] = value;
          _length += 1;
        },
        keys() {
          return Object.keys(store);
        }
      };
    },
    all: {},
    get length() { return _length; }
  };
}

function findIdentityKey(keys, arg, fnCreate) {
  const key = keys.find((x) => deepEqual(x, arg));
  return key === undefined ? fnCreate(arg) : key;
}

function unaryLookup(cache, fn, arg) {
  const key = Immutable.isImmutable(arg) ? arg : findIdentityKey(cache.keys(), arg, Immutable);
  // note: the assumption is that if it's an immutable argument then only compare via identity
  if (cache.has(key)) {
    return cache.get(key);
  } else {
    const value = fn(arg);
    cache.set(key, value);
    return value;
  }
}

function memoize(fn, cacheCreate, name) {
  const caches = cacheCreate.all;
  function fnMemoized(...args) {
    const length = args.length;
    if (!caches.hasOwnProperty(length)) {
      caches[length] = cacheCreate.create();
    }
    let currentCache = caches[length];
    for (let i = 0; i < length - 1; ++i) {
      currentCache = unaryLookup(currentCache, () => cacheCreate.create(), args[i]);
    }
    const lastArg = length === 0 ? undefined : args[length - 1];
    return unaryLookup(currentCache, () => fn(...args), lastArg);
  }
  Object.defineProperty(fnMemoized, 'name', {value: name});
  fnMemoized.cache = cacheCreate;
  return fnMemoized;
}

const mkImmutable = memoize(Immutable, simpleCache(), 'mkImmutable');

describe('Immutable', () => {
  let xs = Immutable([1, 2, 3]);
  it('can be accessed via get item syntax', () => {
    expect(xs[0]).toEqual(1);
  });
  it('throws a TypeError on wrote', () => {
      expect(() => { xs[0] = 2; }).toThrow(TypeError);
  });
  it('can use referential transparency for hashtable lookup', () => {
    let obj1 = [1, 2, 3];
    let obj2 = [1, 2, 3];
    let elements = mkImmutable(obj1);
    let sameElements = mkImmutable(obj2);
    let alsoElements = mkImmutable(Immutable([1, 2, 3]));

    expect(obj1).toEqual(obj2);
    expect(elements).toEqual(sameElements);
    expect(elements).toEqual(alsoElements);
    expect(obj1).not.toBe(obj2);
    expect(elements).toBe(sameElements);
    expect(elements).toBe(alsoElements);
    expect(mkImmutable.name).toEqual('mkImmutable');
  });
  it('can cache empty function call', () => {
    const fn = () => ({});
    const fnMemoized = memoize(fn, simpleCache());
    const obj = fnMemoized();
    expect(fn()).not.toBe(obj);
    expect(fnMemoized()).toBe(obj);
  });
  it('can cache multi argument function call', () => {
    const fn = (a, b) => ({'a': a, 'b': b});
    const fnMemoized = memoize(fn, simpleCache());
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
  it('extra assertions about isImmutable', () => {
    expect(Immutable.isImmutable(undefined)).toBe(true);
    expect(Immutable.isImmutable(() => null)).toBe(true);
    expect(Immutable.isImmutable(Immutable)).toBe(true);
  });
});
