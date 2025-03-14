import { TypeEqual, TypeOf, expectType } from 'ts-expect';
import { Soit } from '../core.types';
import {
  ValuesFromTemplate,
  CapturedGroupsFromTemplate,
  LiteralTemplate,
  CaptureGroupsFromTemplate,
  NextGroups,
} from '../template.types';
import { _soitTemplate } from '../../template';
import { SoitRecord } from '../record.types';

/**
 * LiteralTemplate
 */
/* should return never if contains unknown string */
{
  expectType<TypeEqual<LiteralTemplate<[string]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc', string]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<[string, 123]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc', string, 123]>, never>>(true);
  expectType<
    TypeEqual<
      LiteralTemplate<[Soit<'a' | 'b' | 'c'>, string, Soit<1 | 2 | 3>]>,
      never
    >
  >(true);
}
/* should return never if contains unknown number */
{
  expectType<TypeEqual<LiteralTemplate<[number]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc', number]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<[number, 123]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc', number, 123]>, never>>(true);
  expectType<
    TypeEqual<
      LiteralTemplate<[Soit<'a' | 'b' | 'c'>, number, Soit<1 | 2 | 3>]>,
      never
    >
  >(true);
}
/* should return never if contains unknown boolean */
{
  expectType<TypeEqual<LiteralTemplate<[boolean]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc', boolean]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<[boolean, 123]>, never>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc', boolean, 123]>, never>>(true);
  expectType<
    TypeEqual<
      LiteralTemplate<[Soit<'a' | 'b' | 'c'>, boolean, Soit<1 | 2 | 3>]>,
      never
    >
  >(true);
}
/* should return unknown if primitive */
{
  expectType<TypeEqual<LiteralTemplate<[true]>, unknown>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc']>, unknown>>(true);
  expectType<TypeEqual<LiteralTemplate<[123]>, unknown>>(true);
  expectType<TypeEqual<LiteralTemplate<['abc', false, 123]>, unknown>>(true);
}

/**
 * ValuesFromTemplate
 */
/* should return a union with all possible values from template (no Soit) */
{
  type Result = ValuesFromTemplate<['simple', 'string', 'template']>;
  expectType<TypeEqual<Result, 'simplestringtemplate'>>(true);
}
/* should return a union with all possible values from template (one Soit) */
{
  type Result = ValuesFromTemplate<
    [Soit<'uncertain' | 'variable'>, 'string', 'template']
  >;
  expectType<
    TypeEqual<Result, 'uncertainstringtemplate' | 'variablestringtemplate'>
  >(true);
}
/* should return a union with all possible values from template (one SoitRecord) */
{
  type Result = ValuesFromTemplate<
    ['60', SoitRecord<{ minute: 'm', seconds: 's'}>]
  >;
  expectType<
    TypeEqual<Result, '60s' | '60m'>
  >(true);
}
/* should return a union with all possible values from template (many Soit) */
{
  type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  type Result = ValuesFromTemplate<
    [Soit<Digit>, '-', Soit<Digit>, '-', Soit<Digit>]
  >;
  expectType<TypeEqual<Result, `${Digit}-${Digit}-${Digit}`>>(true);
}

/**
 * NextGroups
 */
/* should capture the first value */
{
  type Result = NextGroups<
    Soit<'uncertain' | 'variable'>,
    'uncertainstringtemplate',
    '',
    [],
    true
  >;
  expectType<TypeEqual<Result, ['uncertain']>>(true);
}
/* should capture the first value (number) */
{
  type Result = NextGroups<Soit<100 | '200'>, '100px', '', [], true>;
  expectType<TypeEqual<Result, ['100']>>(true);
}
/* should capture the first value (boolean) */
{
  type Result = NextGroups<Soit<true | false>, 'true!', '', [], true>;
  expectType<TypeEqual<Result, ['true']>>(true);
}
/* should not capture partial value if no rest expected */
{
  type Result = NextGroups<
    Soit<'uncertain' | 'variable'>,
    'uncertainstringtemplate',
    '',
    []
  >;
  expectType<TypeEqual<Result, null>>(true);
}
/* should capture whole value if no rest expected */
{
  type Result = NextGroups<Soit<'uncertain' | 'variable'>, 'uncertain', '', []>;
  expectType<TypeEqual<Result, ['uncertain']>>(true);
}
/* should capture last part if no rest expected */
{
  type Result = NextGroups<Soit<'px' | 'em'>, '100em', '100', []>;
  expectType<TypeEqual<Result, ['em']>>(true);
}
/* should capture return null if capture group dont match */
{
  type Result = NextGroups<
    Soit<'uncertain' | 'variable'>,
    'unknownstringtemplate',
    '',
    [],
    true
  >;
  expectType<TypeEqual<Result, null>>(true);
}
/* should accumulate captured values */
{
  type Result = NextGroups<Soit<'px' | 'em'>, '100px', '100', ['100'], true>;
  expectType<TypeEqual<Result, ['100', 'px']>>(true);
}
/* should keep previous captured values */
{
  type Result = NextGroups<
    'string',
    'uncertainstringtemplate',
    'uncertain',
    ['uncertain'],
    true
  >;
  expectType<TypeEqual<Result, ['uncertain']>>(true);
}
/* should keep previous captured values (with no rest) */
{
  type Result = NextGroups<
    'template',
    'uncertainstringtemplate',
    'uncertainstring',
    ['uncertain']
  >;
  expectType<TypeEqual<Result, ['uncertain']>>(true);
}
/* should loose previous captured values if no match */
{
  type Result = NextGroups<
    'string',
    'uncertainstringtemplate',
    'uncertain',
    ['uncertain']
  >;
  expectType<TypeEqual<Result, null>>(true);
}

/**
 * CaptureGroupsFromTemplate
 */
/* should return empty capture tuple if no Soit in template */
{
  // GIVEN
  type TemplateValues = ['simple', 'string', 'template'];

  // WHEN
  type Result = CaptureGroupsFromTemplate<TemplateValues>;

  // THEN
  expectType<TypeEqual<Result, [] | null>>(true);
}
/* should return capture tuple with one value if one Soit in template */
{
  // GIVEN
  type TemplateValues = [Soit<'uncertain' | 'variable'>, 'string', 'template'];

  // WHEN
  type Result = CaptureGroupsFromTemplate<TemplateValues>;

  // THEN
  expectType<TypeEqual<Result, ['uncertain' | 'variable'] | null>>(true);
}
/* should return capture tuple with two values if two Soit in template */
{
  // GIVEN
  type TemplateValues = [Soit<true | false>, '-', Soit<1 | 2 | 3>];

  // WHEN
  type Result = CaptureGroupsFromTemplate<TemplateValues>;

  // THEN
  expectType<TypeOf<Result, ['false' | 'true', '1' | '2' | '3'] | null>>(true);
  expectType<TypeOf<['false' | 'true', '1' | '2' | '3'] | null, Result>>(true);
}

/**
 * CapturedGroupsFromTemplate
 */
/* should return empty capture tuple if no Soit in template */
{
  // GIVEN
  type TemplateValues = ['simple', 'string', 'template'];

  // WHEN
  type Result = CapturedGroupsFromTemplate<
    TemplateValues,
    ValuesFromTemplate<TemplateValues>
  >;

  // THEN
  expectType<TypeEqual<Result, []>>(true);
}
/* should return capture tuple with one value if one Soit in template */
{
  // GIVEN
  type TemplateValues = [Soit<'uncertain' | 'variable'>, 'string', 'template'];

  // WHEN
  type Result = CapturedGroupsFromTemplate<
    TemplateValues,
    ValuesFromTemplate<TemplateValues>
  >;

  // THEN
  expectType<TypeEqual<Result, ['uncertain'] | ['variable']>>(true);
}
/* should return capture tuple with two values if two Soit in template */
{
  // GIVEN
  type TemplateValues = [Soit<true | false>, '-', Soit<1 | 2 | 3>];

  // WHEN
  type Result = CapturedGroupsFromTemplate<
    TemplateValues,
    ValuesFromTemplate<TemplateValues>
  >;

  // THEN
  expectType<TypeOf<Result, ['false' | 'true', '1' | '2' | '3']>>(true);
  expectType<TypeOf<['false' | 'true', '1' | '2' | '3'], Result>>(true);
}
