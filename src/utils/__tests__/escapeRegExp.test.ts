import { escapeRegExp } from '../escapeRegExp';

describe('escapeRegExp', () => {
  it('should escape special characters to be used in a regular expression', () => {
    expect(escapeRegExp('a')).toBe('a');
    expect(escapeRegExp('a.b')).toBe('a\\.b');
    expect(escapeRegExp('a-b')).toBe('a\\-b');
    expect(escapeRegExp('a^b')).toBe('a\\^b');
    expect(escapeRegExp('a$b')).toBe('a\\$b');
    expect(escapeRegExp('a*b')).toBe('a\\*b');
    expect(escapeRegExp('a+b')).toBe('a\\+b');
    expect(escapeRegExp('a?b')).toBe('a\\?b');
    expect(escapeRegExp('a.b')).toBe('a\\.b');
    expect(escapeRegExp('a(b')).toBe('a\\(b');
    expect(escapeRegExp('a)b')).toBe('a\\)b');
    expect(escapeRegExp('a|b')).toBe('a\\|b');
    expect(escapeRegExp('a[b')).toBe('a\\[b');
    expect(escapeRegExp('a]b')).toBe('a\\]b');
    expect(escapeRegExp('a{b')).toBe('a\\{b');
    expect(escapeRegExp('a}b')).toBe('a\\}b');
    expect(escapeRegExp('a/b')).toBe('a\\/b');
    expect(escapeRegExp('a\\b')).toBe('a\\\\b');
  });
});
