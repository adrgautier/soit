import Soit from './index';
import * as z from 'zod';

describe('Soit', () => {
  it('should guard for any given string literal', () => {
    const isSet1 = Soit('one', 'two', 'three');
    expect(isSet1('one')).toBe(true);
    expect(isSet1('two')).toBe(true);
    expect(isSet1('three')).toBe(true);
    expect(isSet1('four')).toBe(false);
  });
  it('should guard for any given number literal', () => {
    const isSet1 = Soit(1, 2, 3);
    expect(isSet1(1)).toBe(true);
    expect(isSet1(2)).toBe(true);
    expect(isSet1(3)).toBe(true);
    expect(isSet1(4)).toBe(false);
  });
  it('should guard for any given mixed literal', () => {
    const isSet1 = Soit(1, 'two', false);
    expect(isSet1(1)).toBe(true);
    expect(isSet1('one')).toBe(false);
    expect(isSet1('two')).toBe(true);
    expect(isSet1(2)).toBe(false);
    expect(isSet1(false)).toBe(true);
    expect(isSet1(true)).toBe(false);
  });
  it('should guard for combined Soit instances', () => {
    const isSet1 = Soit(1, 2);
    const isSet2 = Soit('three', 'four');
    const isCombinedSet = Soit(isSet1, isSet2, true);
    expect(isCombinedSet(1)).toBe(true);
    expect(isCombinedSet('one')).toBe(false);
    expect(isCombinedSet(2)).toBe(true);
    expect(isCombinedSet('two')).toBe(false);
    expect(isCombinedSet('three')).toBe(true);
    expect(isCombinedSet(3)).toBe(false);
    expect(isCombinedSet('four')).toBe(true);
    expect(isCombinedSet(4)).toBe(false);
    expect(isCombinedSet(true)).toBe(true);
    expect(isCombinedSet(false)).toBe(false);
  });
  it('should guard for "fake"/"compatible" sets of options', () => {
    const fakeSet = { options: ['one', 2] as const };
    const compatibleSet = z.enum(['three', 'four']);
    const isCombinedSet = Soit(fakeSet, compatibleSet);
    expect(isCombinedSet('one')).toBe(true);
    expect(isCombinedSet(1)).toBe(false);
    expect(isCombinedSet(2)).toBe(true);
    expect(isCombinedSet('two')).toBe(false);
    expect(isCombinedSet('three')).toBe(true);
    expect(isCombinedSet(3)).toBe(false);
    expect(isCombinedSet('four')).toBe(true);
    expect(isCombinedSet(4)).toBe(false);
  });
  it('should not take into account incompatible objects', () => {
    const brokenSet: any = { broken: 'object' };
    const isCombinedSet = Soit(brokenSet, 'one', 2);
    expect(isCombinedSet('one')).toBe(true);
    expect(isCombinedSet(1)).toBe(false);
    expect(isCombinedSet(2)).toBe(true);
    expect(isCombinedSet('two')).toBe(false);
  });
  it('should deduplicate combined sets of options with intersection', () => {
    const isSet1 = Soit('one', 'two', 'three');
    const isSet2 = Soit('two', 'three', 'four');
    const isCombinedSet = Soit(isSet1, isSet2);
    expect(isCombinedSet.options).toEqual(['one', 'two', 'three', 'four']);
  });
  it('should be able to create subsets', () => {
    const isSet = Soit('one', 'two', 'three', 'four');
    const isSubSet = isSet.sub('three', 'four');
    expect(isSubSet("one")).toBe(false);
    expect(isSubSet("two")).toBe(false);
    expect(isSubSet("three")).toBe(true);
    expect(isSubSet("four")).toBe(true);
    expect(isSubSet.options).toEqual(["three", "four"]);
  });
  it('should check object prop', () => {
    const isSet = Soit('one', 'two');
    expect(isSet({ prop: "one" }, "prop")).toBe(true);
    expect(isSet({ prop: "two" }, "prop")).toBe(true);
    expect(isSet({ prop: "three" }, "prop")).toBe(false);
    expect(isSet({ prop: "four" }, "prop")).toBe(false);
  })
});

