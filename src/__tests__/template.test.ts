import { _soitCore } from '../core';
import { _soitTemplate } from '../template';
import Soit from '../index';

describe('SoitTemplate', () => {
  it('should test a simple template', () => {
    const mapMock = jest.fn();
    const forEachMock = jest.fn();
    const template = _soitTemplate(
      _soitCore(['a', 'b']),
      '-',
      _soitCore(['c', 'd'])
    );
    expect(template('a-c')).toBe(true);
    expect(template('a-d')).toBe(true);
    expect(template('b-c')).toBe(true);
    expect(template('b-d')).toBe(true);
    expect(template('a')).toBe(false);
    expect(template('c')).toBe(false);
    expect(template('a-d-e')).toBe(false);
    expect(Array.from(template)).toEqual(['a-c', 'a-d', 'b-c', 'b-d']);
    expect(template.capture('a-d')).toEqual(['a', 'd']);
    expect(template.capture('ad')).toEqual(null);
    expect(template.capture('1-2')).toEqual(null);

    template.map(mapMock);
    expect(mapMock).toHaveBeenCalledTimes(4);
    expect(mapMock).toHaveBeenNthCalledWith(1, 'a-c', 0, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);
    expect(mapMock).toHaveBeenNthCalledWith(2, 'a-d', 1, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);
    expect(mapMock).toHaveBeenNthCalledWith(3, 'b-c', 2, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);
    expect(mapMock).toHaveBeenNthCalledWith(4, 'b-d', 3, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);

    template.forEach(forEachMock);
    expect(forEachMock).toHaveBeenCalledTimes(4);
    expect(forEachMock).toHaveBeenNthCalledWith(1, 'a-c', 0, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);
    expect(forEachMock).toHaveBeenNthCalledWith(2, 'a-d', 1, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);
    expect(forEachMock).toHaveBeenNthCalledWith(3, 'b-c', 2, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);
    expect(forEachMock).toHaveBeenNthCalledWith(4, 'b-d', 3, [
      'a-c',
      'a-d',
      'b-c',
      'b-d',
    ]);
  });
  it('should test a complex template', () => {
    const mapMock = jest.fn();
    const forEachMock = jest.fn();
    const digit = Soit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const template = Soit.Template(digit, '-', digit, '-', digit);
    expect(template('1-2-3')).toBe(true);
    const result = template.capture('1-2-3');
    if (result) {
      const [a, b, c] = result;
      expect(a).toBe('1');
      expect(b).toBe('2');
      expect(c).toBe('3');
    }
    expect(template.capture('1-2-3')).toEqual(['1', '2', '3']);
    expect(Array.from(template).join('|')).toMatchSnapshot();
    expect(template.capture('a-b-c')).toBe(null);
    expect(template.capture('123')).toBe(null);

    template.map(mapMock);
    expect(mapMock).toHaveBeenCalledTimes(1000);

    template.forEach(forEachMock);
    expect(forEachMock).toHaveBeenCalledTimes(1000);
  });
});
