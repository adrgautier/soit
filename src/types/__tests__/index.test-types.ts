import { TypeEqual, expectType } from 'ts-expect';
import Soit from '../..';

{
  // GIVEN
  const Digit = Soit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const Template = Soit.Template(Digit, '-', Digit, '-', Digit);

  // WHEN
  type Digit = ReturnType<typeof Digit>;
  type Template = ReturnType<typeof Template>;

  //THEN
  expectType<TypeEqual<Template, `${Digit}-${Digit}-${Digit}`>>(true);
}

{
  // GIVEN
  const Fruits = Soit(['apple', 'orange', 'kiwi']);
  const Template = Soit.Template('Eat ', Fruits);

  // WHEN
  type Fruits = ReturnType<typeof Fruits>;
  type Template = ReturnType<typeof Template>;

  //THEN
  expectType<TypeEqual<Template, `Eat ${Fruits}`>>(true);
}