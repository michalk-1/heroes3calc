import Immutable from 'seamless-immutable';
import deepEqual from 'deep-equal';

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

module.exports.Immutable = memoize(Immutable, simpleCache());
