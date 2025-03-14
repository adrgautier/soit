import Soit from '../index';

describe('Soit', () => {
  it('should guard for any given string literal', () => {
    const isSet1 = Soit(['one', 'two', 'three']);
    expect(isSet1.guard('one')).toBe(true);
    expect(isSet1.guard('two')).toBe(true);
    expect(isSet1.guard('three')).toBe(true);
    expect(isSet1.guard('four')).toBe(false);
    expect(Array.from(isSet1)).toEqual(['one', 'two', 'three']);
    expect([...isSet1]).toEqual(['one', 'two', 'three']);
  });
  it('should guard for any given number literal', () => {
    const isSet1 = Soit([1, 2, 3]);
    expect(isSet1.guard(1)).toBe(true);
    expect(isSet1.guard(2)).toBe(true);
    expect(isSet1.guard(3)).toBe(true);
    expect(isSet1.guard(4)).toBe(false);
  });
  it('should guard for any given mixed literal', () => {
    const isSet1 = Soit([1, 'two', false]);
    expect(isSet1.guard(1)).toBe(true);
    expect(isSet1.guard('one')).toBe(false);
    expect(isSet1.guard('two')).toBe(true);
    expect(isSet1.guard(2)).toBe(false);
    expect(isSet1.guard(false)).toBe(true);
    expect(isSet1.guard(true)).toBe(false);
  });
  it('should guard for combined iterable', () => {
    const isSet1 = Soit([1, 2]);
    const isSet2 = Soit(['three', 'four']);
    const isCombinedSet = Soit([...isSet1, ...isSet2, true]);
    expect(isCombinedSet.guard(1)).toBe(true);
    expect(isCombinedSet.guard('one')).toBe(false);
    expect(isCombinedSet.guard(2)).toBe(true);
    expect(isCombinedSet.guard('two')).toBe(false);
    expect(isCombinedSet.guard('three')).toBe(true);
    expect(isCombinedSet.guard(3)).toBe(false);
    expect(isCombinedSet.guard('four')).toBe(true);
    expect(isCombinedSet.guard(4)).toBe(false);
    expect(isCombinedSet.guard(true)).toBe(true);
    expect(isCombinedSet.guard(false)).toBe(false);
  });
  it('should deduplicate combined sets of options with intersection', () => {
    const isSet1 = Soit(['one', 'two', 'three']);
    const isSet2 = Soit(['two', 'three', 'four']);
    const isCombinedSet = Soit([...isSet1, ...isSet2]);
    expect(Array.from(isCombinedSet)).toEqual(['one', 'two', 'three', 'four']);
  });
  it('should be able to create subsets', () => {
    const isSet = Soit(['one', 'two', 'three', 'four']);
    const isSubSet = isSet.subset(['three', 'four']);
    expect(isSubSet.guard('one')).toBe(false);
    expect(isSubSet.guard('two')).toBe(false);
    expect(isSubSet.guard('three')).toBe(true);
    expect(isSubSet.guard('four')).toBe(true);
    expect(Array.from(isSubSet)).toEqual(['three', 'four']);
  });
  it('should be able to extend values', () => {
    const isSet = Soit(['one', 'two', 'three']);
    const isExtendedSet = isSet.extend(['two', 'three', 'four']);
    expect(isExtendedSet.guard('one')).toBe(true);
    expect(isExtendedSet.guard('two')).toBe(true);
    expect(isExtendedSet.guard('three')).toBe(true);
    expect(isExtendedSet.guard('four')).toBe(true);
    expect(Array.from(isExtendedSet)).toEqual(['one', 'two', 'three', 'four']);
  });
  it('should be able to diff values', () => {
    const isSet = Soit(['one', 'two', 'three']);
    const isDifferenceSet = isSet.difference(['three', 'four']);
    expect(isDifferenceSet.guard('one')).toBe(true);
    expect(isDifferenceSet.guard('two')).toBe(true);
    expect(isDifferenceSet.guard('three')).toBe(false);
    expect(isDifferenceSet.guard('four')).toBe(false);
    expect(Array.from(isDifferenceSet)).toEqual(['one', 'two']);
  });
  it('should be able to create a template', () => {
    const isSet = Soit(['one', 'two', 'three']);
    const isTemplate = Soit.Template('$', isSet);
    expect(Array.from(isTemplate)).toEqual(['$one', '$two', '$three']);
    expect(isTemplate.guard('$one')).toBe(true);
    expect(isTemplate.guard('$two')).toBe(true);
    expect(isTemplate.guard('$three')).toBe(true);
    expect(isTemplate.guard('$four')).toBe(false);
    expect(isTemplate.guard('one')).toBe(false);
    expect(isTemplate.capture('$one')).toEqual(['one']);
    expect(isTemplate.capture('$two')).toEqual(['two']);
    expect(isTemplate.capture('$three')).toEqual(['three']);
    expect(isTemplate.capture('$four')).toBe(null);
    expect(isTemplate.capture('one')).toBe(null);
  });
});
