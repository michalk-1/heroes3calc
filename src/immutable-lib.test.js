import Immutable from 'seamless-immutable';
import { memoize, Immutable as cachedImmutable } from './immutable-lib.js';

describe('Immutable', () => {
    it('can be accessed via get item syntax', () => {
        const xs = Immutable([1, 2, 3]);
        expect(xs[0]).toEqual(1);
    });
    it('throws a TypeError on wrote', () => {
        const xs = Immutable([1, 2, 3]);
        expect(() => { xs[0] = 2; }).toThrow(TypeError);
    });
    it('can use referential transparency for hashtable lookup', () => {
        let obj1 = [1, 2, 3];
        let obj2 = [1, 2, 3];
        let elements = cachedImmutable(obj1);
        let sameElements = cachedImmutable(obj2);
        let alsoElements = cachedImmutable(Immutable([1, 2, 3]));

        expect(obj1).toEqual(obj2);
        expect(elements).toEqual(sameElements);
        expect(elements).toEqual(alsoElements);
        expect(obj1).not.toBe(obj2);
        expect(elements).toBe(sameElements);
        expect(elements).toBe(alsoElements);
        expect(cachedImmutable.name).toEqual(Immutable.name);
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
    it('extra assertions about isImmutable', () => {
        expect(Immutable.isImmutable(undefined)).toBe(true);
        expect(Immutable.isImmutable(() => null)).toBe(true);
        expect(Immutable.isImmutable(Immutable)).toBe(true);
    });
});
