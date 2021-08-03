import soit from './index';
import * as z from 'zod';

describe('Soit', () => {
  it('should guard for any given string literal', () => {
    const isSet1 = soit('one', 'two', 'three');
    expect(isSet1('one')).toBe(true);
    expect(isSet1('two')).toBe(true);
    expect(isSet1('three')).toBe(true);
    expect(isSet1('four')).toBe(false);
  });
  it('should guard for any given number literal', () => {
    const isSet1 = soit(1, 2, 3);
    expect(isSet1(1)).toBe(true);
    expect(isSet1(2)).toBe(true);
    expect(isSet1(3)).toBe(true);
    expect(isSet1(4)).toBe(false);
  });
  it('should guard for any given mixed literal', () => {
    const isSet1 = soit(1, 'two', false);
    expect(isSet1(1)).toBe(true);
    expect(isSet1('one')).toBe(false);
    expect(isSet1('two')).toBe(true);
    expect(isSet1(2)).toBe(false);
    expect(isSet1(false)).toBe(true);
    expect(isSet1(true)).toBe(false);
  });
  it('should guard for combined soit instances', () => {
    const isSet1 = soit(1, 2);
    const isSet2 = soit('three', 'four');
    const isCombinedSet = soit(isSet1, isSet2, true);
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
    const fakeSet = { options: ['one', 2] };
    const compatibleSet = z.enum(['three', 'four']);
    const isCombinedSet = soit(fakeSet, compatibleSet);
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
    const isCombinedSet = soit(brokenSet, 'one', 2);
    expect(isCombinedSet('one')).toBe(true);
    expect(isCombinedSet(1)).toBe(false);
    expect(isCombinedSet(2)).toBe(true);
    expect(isCombinedSet('two')).toBe(false);
  });
});
