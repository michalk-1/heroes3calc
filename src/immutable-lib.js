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
      let argstore = {};
      return {
        has(key) {
          return hasOwnProperty.call(store, key);
        },
        get(key) {
          return store[key];
        },
        set(key, arg, value) {
          store[key] = value;
          argstore[key] = arg;
          _length += 1;
        },
        keys() {
          return Object.keys(store).map((x) => [x, argstore[x]]);
        }
      };
    },
    all: {},
    get length() { return _length; }
  };
}

function findIdentityKey(keys, arg) {
  const pair = keys.find((p) => p[1] === arg || deepEqual(p[1], arg));  // p : pair of (key, arg)
  // TODO: skip the find if the arg is immutable and the UUID can be saved with the object
  return pair === undefined ? generateUUID() : pair[0];
}

function unaryLookup(cache, fn, arg) {
  const key = findIdentityKey(cache.keys(), arg);
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
PMap.set = memoize(Immutable.Map.prototype.set.call);

export const PList = memoize(Immutable.List);
PList.push = memoize(Immutable.List.prototype.push.call);
