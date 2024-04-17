import { TypeEqual, expectType } from 'ts-expect';
import Soit, { Infer } from '../..';

/* Infer generic should work for both Soit and SoitTemplate */
{
  // GIVEN
  const isDigit = Soit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const template = Soit.Template(isDigit, '-', isDigit, '-', isDigit);

  // WHEN
  type Digit = Infer<typeof isDigit>;
  type Template = Infer<typeof template>;

  //THEN
  expectType<TypeEqual<Template, `${Digit}-${Digit}-${Digit}`>>(true);
}
/* Infer generic shoud return never if not Soit or SoitTemplate */
{
  // GIVEN
  const object = {};

  // WHEN
  type Object = Infer<typeof object>;

  // THEN
  expectType<TypeEqual<Object, never>>(true);
}
