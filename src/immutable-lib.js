import Immutable from 'immutable';
import deepEqual from 'deep-equal';

function generateUUID() { // Public Domain/MIT
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function simpleCache() {
  let _length = 0;
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  return {
    create() {
      let store = {};
      let weakstore = new WeakMap();
      return {
        has(key) {
          return hasIdentity(key) ? weakstore.has(key) : hasOwnProperty.call(store, key);
        },
        get(key) {
          return hasIdentity(key) ? weakstore.get(key) : store[key];
        },
        set(key, value) {
          if (hasIdentity(key)) {
            weakstore.set(key, value);
          } else {
            store[key] = value;
          }
          _length += 1;
        },
        keys () {
          return Object.keys(store);
        },
        weakKeys() {
          return Object.keys(weakstore);
        }
      };
    },
    all: {},
    get length() { return _length; }
  };
}

function findIdentityKey(keys, arg) {
  let key = keys.find((x) => isImmutable(x) && deepEqual(x, arg));
  key = key === undefined ? keys.find((x) => deepEqual(x, arg)) : key;
  return key === undefined ? arg : key;
}

function unaryLookup(cache, fn, arg) {
  const key = isImmutable(arg) ? arg : findIdentityKey(cache.weakKeys(), arg)
  // note: the assumption is that if it's an immutable argument then only compare via identity
  if (cache.has(key)) {
      return cache.get(key);
  } else {
      const value = fn(arg);
      cache.set(key, arg, value);
      return value;
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

export const PMap = memoize(Immutable.Map);
PMap.set = memoize((map, key, value) => map.set(key, value));

export const PList = memoize(Immutable.List);
PList.push = memoize((list, x) => list.push(x));

export function hasIdentity(x) {
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
