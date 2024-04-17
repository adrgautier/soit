import { TypeEqual, expectType } from 'ts-expect';
import { Primitive } from '../core.types';

/**
 * Primitive
 */
/* should return never if unknown string */
{
  type Result = Primitive<string>;
  expectType<TypeEqual<Result, never>>(true);
}
/* should return never if unknown number */
{
  type Result = Primitive<number>;
  expectType<TypeEqual<Result, never>>(true);
}
/* should return never if unknown boolean */
{
  type Result = Primitive<boolean>;
  expectType<TypeEqual<Result, never>>(true);
}
/* should return unknown if defined string */
{
  type Result = Primitive<'abc'>;
  expectType<TypeEqual<Result, unknown>>(true);
}
/* should return unknown if defined number */
{
  type Result = Primitive<123>;
  expectType<TypeEqual<Result, unknown>>(true);
}
/* should return unknown if defined boolean */
{
  type Result = Primitive<true>;
  expectType<TypeEqual<Result, unknown>>(true);
}
