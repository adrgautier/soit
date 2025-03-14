import { _soitCore } from '../core';
import { _soitTemplate } from '../template';
import Soit from '../index';

describe('SoitTemplate', () => {
  it('should test a simple template', () => {
    const template = _soitTemplate(
      _soitCore(['a', 'b']),
      '-',
      _soitCore(['c', 'd'])
    );
    expect(template.guard('a-c')).toBe(true);
    expect(template.guard('a-d')).toBe(true);
    expect(template.guard('b-c')).toBe(true);
    expect(template.guard('b-d')).toBe(true);
    expect(template.guard('a')).toBe(false);
    expect(template.guard('c')).toBe(false);
    expect(template.guard('a-d-e')).toBe(false);
    expect(Array.from(template)).toEqual(['a-c', 'a-d', 'b-c', 'b-d']);
    expect(template.capture('a-d')).toEqual(['a', 'd']);
    expect(template.capture('ad')).toEqual(null);
    expect(template.capture('1-2')).toEqual(null);
  });
  it('should test a complex template', () => {
    const digit = Soit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const template = Soit.Template(digit, '-', digit, '-', digit);
    expect(template.guard('1-2-3')).toBe(true);
    expect(template.capture('1-2-3')).toEqual(['1', '2', '3']);
    expect(Array.from(template).join('|')).toMatchSnapshot();
    expect(template.capture('a-b-c')).toBe(null);
    expect(template.capture('123')).toBe(null);
  });
  it('should test a template with record', () => {
    const digit = Soit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const unit = Soit.Record({ minute: 'm', seconds: 's'} as const);
    const template = Soit.Template(digit, unit);
    expect(template.guard('1s')).toBe(true);
    expect(template.capture('1s')).toEqual(['1', 's']);
    expect(Array.from(template).join('|')).toMatchSnapshot();
    expect(template.capture('1h')).toBe(null);
    expect(template.capture('12m')).toBe(null);
  });
});
