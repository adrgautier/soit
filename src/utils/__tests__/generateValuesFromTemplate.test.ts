import { _soitCore } from '../../core';
import { generateValuesFromTemplate } from '../generateValuesFromTemplate';

describe('generateValuesFromTemplate', () => {
  it('should generate values from a simple template', () => {
    const template = ['a', 'b', 'c'] as any;
    const values = generateValuesFromTemplate(template);
    expect(values).toEqual(['abc']);
  });
  it('should generate values from a dynamic template', () => {
    const template = [
      _soitCore([1, 2, 3]),
      _soitCore(['a', 'b', 'c']),
    ] as const;
    const values = generateValuesFromTemplate(template);
    expect(values).toEqual([
      '1a',
      '1b',
      '1c',
      '2a',
      '2b',
      '2c',
      '3a',
      '3b',
      '3c',
    ]);
  });
});
