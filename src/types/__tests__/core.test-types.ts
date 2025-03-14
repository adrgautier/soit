import { TypeEqual, expectType } from 'ts-expect';
import { Literal } from '../core.types';

/**
 * Primitive
 */
/* should return never if unknown string */
{
  type Result = Literal<string>;
  expectType<TypeEqual<Result, never>>(true);
}
/* should return never if unknown number */
{
  type Result = Literal<number>;
  expectType<TypeEqual<Result, never>>(true);
}
/* should return never if unknown boolean */
{
  type Result = Literal<boolean>;
  expectType<TypeEqual<Result, never>>(true);
}
/* should return unknown if defined string */
{
  type Result = Literal<'abc'>;
  expectType<TypeEqual<Result, unknown>>(true);
}
/* should return unknown if defined number */
{
  type Result = Literal<123>;
  expectType<TypeEqual<Result, unknown>>(true);
}
/* should return unknown if defined boolean */
{
  type Result = Literal<true>;
  expectType<TypeEqual<Result, unknown>>(true);
}
