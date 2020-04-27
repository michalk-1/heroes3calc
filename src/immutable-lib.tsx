import Immutable from 'immutable';
import deepEqual from "deep-equal";

type Cache = {
    create(): {
        has(key: any): boolean;
        get(key: any): any;
        set(key: any, value: any): void;
        delete(key: any): void;
        keys(): IterableIterator<any>;
    };
    all: Map<any, any>;
}

export const gSimpleCaches: Cache[] = [];
export const gCacheMisses = {};
export const gCacheHits = {};
export const gCacheLongHits = {};

// Creates a function that memoizes the result of func. If resolver is provided, it determines
// the cache key for storing the result based on the arguments provided to the memoized function.
// By default, the first argument provided to the memoized function is used as the map cache key.
// The func is invoked with the this binding of the memoized function.
//
// Note: The cache is exposed as the cache property on the memoized function. Its creation may be
// customized by replacing the cacheCreate argument with one whose instances implement the Map
// method interface of clear, delete, get, has, and set. The cache instance is then available
// under 'cache' property of the memoized function.

function simpleCache() {
  const cache: Cache = {
    create() {
      let store = new Map();  // this map is doing deep equal and Immutable structures maintain some counters
      return {
        has(key) {
          if (Immutable.isImmutable(key))
            return store.has(Immutable.hash(key));
          else
            return store.has(key);
        },
        get(key) {
          if (Immutable.isImmutable(key))
            return store.get(Immutable.hash(key));
          else
            return store.get(key);
        },
        set(key, value) {
          if (Immutable.isImmutable(key))
            store.set(Immutable.hash(key), value);
          else
            store.set(key, value);
        },
        delete(key)  {
          store.delete(key);
        },
        keys() {
          return store.keys();
        },
      };
    },
    all: new Map(),  // caches by number of arguments that the function was called with
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

function unaryLookup(cache, fn, arg, name?) {
  if (cache.has(arg)) {
    const result = cache.get(arg);
    if (name !== undefined) {
      gCacheHits[name] += 1;
    }
    return result;
  } else {
    const keyOpt = findIdentityKey(cache.keys(), arg);
    if (keyOpt !== undefined && cache.has(keyOpt)) {
      const result = cache.get(keyOpt);
      if (isImmutable(arg)) {
        cache.set(arg, result);
        cache.delete(keyOpt);
      }
      if (name !== undefined) {
        gCacheLongHits[name] += 1;
      }
      return result;
    } else {
      const result = fn(arg);
      cache.set(arg, result);
      if (name !== undefined) {
        gCacheMisses[name] += 1;
      }
      return result;
    }
  }
}

export function memoize(fn, cacheCreate?) {
  if (cacheCreate === undefined) {
    cacheCreate = simpleCache();
  }
  const caches = cacheCreate.all || new Map();
  function fnMemoized(...args) {
    const length = args.length;
    if (!caches.has(length)) {
      caches.set(length, cacheCreate.create());
    }
    let currentCache = caches.get(length);
    for (let i = 0; i < length - 1; ++i) {
      const createCall = () => cacheCreate.create();
      currentCache = unaryLookup(currentCache, createCall, args[i]);
    }
    const lastArg = length === 0 ? undefined : args[length - 1];
    const retrieveCall = () => fn(...args);
    return unaryLookup(currentCache, retrieveCall, lastArg, fn.name);
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
