import Soit from '../src/index';

describe('Soit', () => {
  it('should guard for any given string literal', () => {
    const isSet1 = Soit(['one', 'two', 'three']);
    expect(isSet1('one')).toBe(true);
    expect(isSet1('two')).toBe(true);
    expect(isSet1('three')).toBe(true);
    expect(isSet1('four')).toBe(false);
    expect(Array.from(isSet1)).toEqual(['one', 'two', 'three']);
    expect([...isSet1]).toEqual(['one', 'two', 'three']);
  });
  it('should guard for any given number literal', () => {
    const isSet1 = Soit([1, 2, 3]);
    expect(isSet1(1)).toBe(true);
    expect(isSet1(2)).toBe(true);
    expect(isSet1(3)).toBe(true);
    expect(isSet1(4)).toBe(false);
  });
  it('should guard for any given mixed literal', () => {
    const isSet1 = Soit([1, 'two', false]);
    expect(isSet1(1)).toBe(true);
    expect(isSet1('one')).toBe(false);
    expect(isSet1('two')).toBe(true);
    expect(isSet1(2)).toBe(false);
    expect(isSet1(false)).toBe(true);
    expect(isSet1(true)).toBe(false);
  });
  it('should guard for combined iterable', () => {
    const isSet1 = Soit([1, 2]);
    const isSet2 = Soit(['three', 'four']);
    const isCombinedSet = Soit([...isSet1, ...isSet2, true]);
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
  it('should deduplicate combined sets of options with intersection', () => {
    const isSet1 = Soit(['one', 'two', 'three']);
    const isSet2 = Soit(['two', 'three', 'four']);
    const isCombinedSet = Soit([...isSet1, ...isSet2]);
    expect(Array.from(isCombinedSet)).toEqual(['one', 'two', 'three', 'four']);
  });
  it('should be able to map values', () => {
    const isSet1 = Soit(['one', 'two', 'three']);
    const isSet2 = Soit(['two', 'three', 'four']);
    const isCombinedSet = Soit([...isSet1, ...isSet2]);
    const uppercaseValues = isCombinedSet.map(value => value.toUpperCase());
    expect(uppercaseValues).toEqual(['ONE', 'TWO', 'THREE', 'FOUR']);
  });
  it('should be able to "forEach" values', () => {
    const callbackFunction = jest.fn();
    const isSet1 = Soit(['one', 'two', 'three']);
    const isSet2 = Soit(['two', 'three', 'four']);
    const isCombinedSet = Soit([...isSet1, ...isSet2]);
    isCombinedSet.forEach(value => callbackFunction(value));
    expect(callbackFunction).toHaveBeenCalledTimes(4);
    expect(callbackFunction).toHaveBeenNthCalledWith(1, 'one');
    expect(callbackFunction).toHaveBeenNthCalledWith(2, 'two');
    expect(callbackFunction).toHaveBeenNthCalledWith(3, 'three');
    expect(callbackFunction).toHaveBeenNthCalledWith(4, 'four');
  });
  it('should be able to create subsets', () => {
    const isSet = Soit(['one', 'two', 'three', 'four']);
    const isSubSet = isSet.subset(['three', 'four']);
    expect(isSubSet('one')).toBe(false);
    expect(isSubSet('two')).toBe(false);
    expect(isSubSet('three')).toBe(true);
    expect(isSubSet('four')).toBe(true);
    expect(Array.from(isSubSet)).toEqual(['three', 'four']);
  });
  it('should check object first level prop', () => {
    const isSet = Soit(['one', 'two']);
    expect(isSet({ level1: 'one' }, 'level1')).toBe(true);
    expect(isSet({ level1: 'two' }, 'level1')).toBe(true);
    expect(isSet({ level1: 'three' }, 'level1')).toBe(false);
    expect(isSet({ level1: 'four' }, 'level1')).toBe(false);
  });
  it('should check object second level prop', () => {
    const isSet = Soit(['one', 'two']);
    expect(isSet({ level1: { level2: 'one' } }, 'level1.level2')).toBe(true);
    expect(isSet({ level1: { level2: 'two' } }, 'level1.level2')).toBe(true);
    expect(isSet({ level1: { level2: 'three' } }, 'level1.level2')).toBe(false);
    expect(isSet({ level1: { level2: 'four' } }, 'level1.level2')).toBe(false);
  });
  it('should check object third level prop', () => {
    const isSet = Soit(['one', 'two']);
    expect(
      isSet({ level1: { level2: { level3: 'one' } } }, 'level1.level2.level3')
    ).toBe(true);
    expect(
      isSet({ level1: { level2: { level3: 'two' } } }, 'level1.level2.level3')
    ).toBe(true);
    expect(
      isSet({ level1: { level2: { level3: 'three' } } }, 'level1.level2.level3')
    ).toBe(false);
    expect(
      isSet({ level1: { level2: { level3: 'four' } } }, 'level1.level2.level3')
    ).toBe(false);
  });
  it('should check object fourth level prop', () => {
    const isSet = Soit(['one', 'two']);
    expect(
      isSet(
        { level1: { level2: { level3: { level4: 'one' } } } },
        'level1.level2.level3.level4'
      )
    ).toBe(true);
    expect(
      isSet(
        { level1: { level2: { level3: { level4: 'two' } } } },
        'level1.level2.level3.level4'
      )
    ).toBe(true);
    expect(
      isSet(
        { level1: { level2: { level3: { level4: 'three' } } } },
        'level1.level2.level3.level4'
      )
    ).toBe(false);
    expect(
      isSet(
        { level1: { level2: { level3: { level4: 'four' } } } },
        'level1.level2.level3.level4'
      )
    ).toBe(false);
  });
  it('should handle optional prop', () => {
    const isSet = Soit(['one']);
    expect(isSet({ prop: 'one' } as { prop?: string }, 'prop')).toBe(true);
    expect(isSet({} as { prop?: string }, 'prop')).toBe(false);
    expect(isSet({ prop: 'two' }, 'prop')).toBe(false);
  });
  it('should be able to extend values', () => {
    const isSet = Soit(['one', 'two', 'three']);
    const isExtendedSet = isSet.extend(['two', 'three', 'four']);
    expect(isExtendedSet('one')).toBe(true);
    expect(isExtendedSet('two')).toBe(true);
    expect(isExtendedSet('three')).toBe(true);
    expect(isExtendedSet('four')).toBe(true);
    expect(Array.from(isExtendedSet)).toEqual(['one', 'two', 'three', 'four']);
  });
  it('should be able to diff values', () => {
    const isSet = Soit(['one', 'two', 'three']);
    const isDifferenceSet = isSet.difference(['three', 'four']);
    expect(isDifferenceSet('one')).toBe(true);
    expect(isDifferenceSet('two')).toBe(true);
    expect(isDifferenceSet('three')).toBe(false);
    expect(isDifferenceSet('four')).toBe(false);
    expect(Array.from(isDifferenceSet)).toEqual(['one', 'two']);
  });
});
