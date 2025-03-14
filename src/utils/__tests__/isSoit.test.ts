import { SOIT_SYMBOL } from '../../constants';
import { isSoit } from '../isSoit';

describe('isSoit', () => {
  it('should return true if the value is a Soit object', () => {
    const soit = () => {};
    soit[SOIT_SYMBOL] = true;
    expect(isSoit(soit as any)).toBe(true);
  });

  it('should return false if the value is not a Soit object', () => {
    expect(isSoit('a')).toBe(false);
    expect(isSoit(0)).toBe(false);
    expect(isSoit(true)).toBe(false);
    expect(isSoit(false)).toBe(false);
  });
});
