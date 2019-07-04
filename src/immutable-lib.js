import Immutable from 'immutable';

export let gSimpleCaches = [];

function simpleCache() {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  let _length = 0;
  const cache = {
    create() {
      let store = {};
      let objstore = new WeakMap();
      let objkeys = [];
      return {
        has(key) {
          return hasIdentity(key) ? objstore.has(key) : hasOwnProperty.call(store, key);
        },
        get(key) {
          return hasIdentity(key) ? objstore.get(key) : store[key];
        },
        set(key, value) {
          if (hasIdentity(key)) {
            objstore.set(key, value);
            objkeys.push(key);
          } else {
            store[key] = value;
          }
          _length += 1;
        },
        keys () {
          return Object.keys(store).concat(objkeys);
        }
      };
    },
    all: {},
    get length() { return _length; }
  };
  gSimpleCaches.push(cache);
  return cache;
}

function findIdentityKey(keys, arg) {
  return keys.find(x => Immutable.is(x, arg));
}

function unaryLookup(cache, fn, arg) {
  if (!isImmutable(arg)) {
    throw TypeError('Immutable argument ' + String(arg) + ' passed to ' + fn.name + '.');
  }
  if (cache.has(arg)) {
    return cache.get(arg);
  } else {
    const keyOpt = findIdentityKey(cache.keys(), arg);
    if (keyOpt !== undefined && cache.has(keyOpt)) {
      return cache.get(keyOpt);
    } else {
      const value = fn(arg);
      cache.set(arg, value);
      return value;
    }
  }
}

export function memoize(fn, cacheCreate) {
  if (cacheCreate === undefined) {
    cacheCreate = simpleCache();
  }
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
  Object.defineProperty(fnMemoized, 'name', {value: fn.name});
  fnMemoized.cache = cacheCreate;
  return fnMemoized;
}

function hasIdentity(x) {
  return typeof x === 'object' || typeof x === 'function';
}

export function isImmutable(x) {
  if (Immutable.isImmutable(x)) return true;
  return (
    typeof x === 'number' ||
    typeof x === 'string' ||
    typeof x === 'boolean' ||
    typeof x === 'function' ||
    Object.is(x, undefined) ||
    Object.is(x, null)
  );
}

const makeMap = memoize(Immutable.Map);
export const PMap = (map) => makeMap(Immutable.Map(map));
PMap.set = memoize((map, key, value) => map.set(key, value));

const makeList = memoize(Immutable.List);
export const PList = (list) => makeList(Immutable.List(list));
PList.push = memoize((list, x) => list.push(x));
