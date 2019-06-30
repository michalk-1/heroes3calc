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

const simpleCache = () => ({
  cache: {
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
          // todo: Consider a limited memory case.
        },
        keys() {
          return Object.keys(store);
        }
        // todo: Add 'size' property.
      };
    }
    // todo: Add 'size' method / property.
  }
});

function findIdentityKey(cache, arg) {
  const key = cache.keys().find((x) => deepEqual(x, arg));
  return key === undefined ? Immutable(arg) : key;
}

function memoize(fn, name, cacheCreate) {
  const cache = {0: cacheCreate.cache.create()};
  function fnMemoized(...args) {
    const length = args.length;
    if (length === 1) {
      const unaryCache = cache[0];
      const arg = args[0];
      const key = Immutable.isImmutable(arg) ? arg : findIdentityKey(unaryCache, arg);
      // note: the assumption is that if it's an immutable argument then only compare via identity
      if (unaryCache.has(key)) {
        return unaryCache.get(key);
      } else {
        const value = fn(arg);
        unaryCache.set(key, value);
        return value;
      }
    } else { // todo: test this branch
      if (!cache.hasOwnProperty(args.length)) {
        cache[args.length] = cacheCreate.cache.create();
      }
      const multiCache = cache[args.length];
      const key = findIdentityKey(multiCache, args);
      // todo: Consider a version where the 2nd+ arguments are considered to be hashable parameters.
      //       This way we could lookup the entry by these parameters and then lookup the unary case on the arg.
      if (multiCache.has(key)) {
        return multiCache.get(key);
      } else {
        const value = fn(...args);
        multiCache.set(key, value);
        return value;
      }
    }
  }
  Object.defineProperty(fnMemoized, 'name', {value: name});
  return fnMemoized;
}

const mkImmutable = memoize(Immutable, 'mkImmutable', simpleCache());

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
});
