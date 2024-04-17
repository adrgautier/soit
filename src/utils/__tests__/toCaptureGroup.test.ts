import { _soitCore } from '../../core';
import { toCaptureGroup } from '../toCaptureGroup';

describe('toCaptureGroup', () => {
  it('should return a string with a capture group', () => {
    const value = _soitCore(['a', 'b', 'c']);
    expect(toCaptureGroup(value)).toBe('(a|b|c)');
  });
});
