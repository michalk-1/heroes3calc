import Immutable from 'immutable';
import {console_log, str} from "./util";
import deepEqual from "deep-equal";

export const gSimpleCaches = [];
export const gCacheMisses = {};
export const gCacheHits = {};
export const gCacheLongHits = {};
export const gCacheSize = () => gSimpleCaches.map(x => x.length).reduce((a, x) => a + x);

// Creates a function that memoizes the result of func. If resolver is provided, it determines the cache key for storing
// the result based on the arguments provided to the memoized function. By default, the first argument provided to the
// memoized function is used as the map cache key. The func is invoked with the this binding of the memoized function.
//
// Note: The cache is exposed as the cache property on the memoized function. Its creation may be customized by
// replacing the _.memoize.Cache constructor with one whose instances implement the Map method interface of clear,
// delete, get, has, and set.

function simpleCache() {
  let _length = 0;
  const cache = {
    create() {
      let store = new Map();
      return {
        has(key) {
          return store.has(key);
        },
        get(key) {
          return store.get(key);
        },
        set(key, value) {
          store.set(key, value);
          _length += 1;
        },
        delete(key)  {
          _length -= 1;
          store.delete(key);
        },
        keys() {
          return store.keys();
        },
      };
    },
    all: {},  // caches by number of arguments that the function was called with
    get length() { return _length; }
  };
  gSimpleCaches.push(cache);
  return cache;
}

function findIdentityKey(keys, arg) {
  for (let k of keys) {
    if (Immutable.isImmutable(k) && Immutable.isImmutable(arg)) {
      if (Immutable.is(k, arg))
        return k;
    } else if (deepEqual(k, arg)) {
      return k;
    }
  }
  return undefined;
}

function unaryLookup(cache, fn, arg, name) {
  if (cache.has(arg)) {
    const result = cache.get(arg);
    if (name !== undefined) {
      gCacheHits[name] += 1;
      console_log('Found key:', str(arg), '====', str(result), 'for "' + name + '.');
    } else {
      console_log('Found key:', str(arg), '====', str(result), 'for "?".');
    }
    return result;
  } else {
    const keyOpt = findIdentityKey(cache.keys(), arg);
    if (keyOpt !== undefined && cache.has(keyOpt)) {
      const result = cache.get(keyOpt);
      if (isImmutable(arg)) {
        cache.delete(keyOpt);
        cache.set(arg, result);
      }
      if (name !== undefined) {
        gCacheLongHits[name] += 1;
        console_log('Found by search ', str(arg), '====', str(result), 'for "' + str(name) + '".');
      } else {
        console_log('Found by search ', str(arg), '====', str(result), 'for "?".');
      }
      return result;
    } else {
      const result = fn(arg);
      cache.set(arg, result);
      if (name !== undefined) {
        gCacheMisses[name] += 1;
        console_log('Did not find', str(arg), '====', str(result), 'for "' + str(name) + '".');
      } else {
        console_log('Did not find', str(arg), '====', str(result), 'for "?".');
      }
      return result;
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
    return unaryLookup(currentCache, () => fn(...args), lastArg, fn.name);
  }
  gCacheHits[fn.name] = 0;
  gCacheLongHits[fn.name] = 0;
  gCacheMisses[fn.name] = 0;
  Object.defineProperty(fnMemoized, 'name', {value: fn.name});
  fnMemoized.cache = cacheCreate;
  return fnMemoized;
}

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
