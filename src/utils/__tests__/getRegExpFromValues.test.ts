import { _soitCore } from '../../core';
import { getRegExpFromValues } from '../getRegExpFromValues';

describe('getRegExpFromValues', () => {
  it('should generate a regex from a simple template', () => {
    const template = ['a', 'b', 'c'] as const;
    const regExp = getRegExpFromValues(template);
    expect(regExp.test('abc')).toBe(true);
    expect(regExp.test('abcd')).toBe(false);
  });
  it('should generate a regex from a dynamic template', () => {
    const template = [
      _soitCore(['1', '2', '3']),
      _soitCore(['a', 'b', 'c']),
    ] as const;
    const regExp = getRegExpFromValues(template);
    expect(regExp.test('1a')).toBe(true);
    expect(regExp.test('1b')).toBe(true);
    expect(regExp.test('1c')).toBe(true);
    expect(regExp.test('2a')).toBe(true);
    expect(regExp.test('2b')).toBe(true);
    expect(regExp.test('2c')).toBe(true);
    expect(regExp.test('3a')).toBe(true);
    expect(regExp.test('3b')).toBe(true);
    expect(regExp.test('3c')).toBe(true);
    expect(regExp.test('4a')).toBe(false);
    expect(regExp.test('4b')).toBe(false);
    expect(regExp.test('4c')).toBe(false);
  });
});
