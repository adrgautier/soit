/**
 * This file is not a regular test file.
 * In order for those tests to be validated,
 * the file needs to compile without error.
 */
import { expectType, expectNever, TypeEqual } from 'ts-expect';
import Soit from '../index';
import { _soitTemplate } from '../template';

/**
 * Should prevent unknown literals array
 */
{
  const set1 = ['one', 'two'];
  const one = 'one';

  // @ts-expect-error
  const Set1 = Soit(set1);
  type Set1 = ReturnType<typeof Set1>;

  expectType<TypeEqual<Set1, any>>(true);
  if (Set1.guard(one)) {
    expectNever(one);
  }
}

/**
 * Should guard and infer any given string literal
 */
{
  const set1 = ['one', 'two'] as const;
  const one = 'one';
  const two = 'two';
  const three = 'three';

  const Set1 = Soit(set1);
  type Set1 = ReturnType<typeof Set1>;

  expectType<TypeEqual<Set1, 'one' | 'two'>>(true);
  if (Set1.guard(one)) {
    expectType<Set1>(one);
    // @ts-expect-error
    expectNever(one);
  }
  if (Set1.guard(two)) {
    expectType<Set1>(two);
    // @ts-expect-error
    expectNever(two);
  }
  if (Set1.guard(three)) {
    expectNever(three);
  }
}

/**
 * Should guard and infer any given number literal
 */
{
  const set1 = [1, 2] as const;
  const one = 1;
  const two = 2;
  const three = 3;

  const Set1 = Soit(set1);
  type Set1 = ReturnType<typeof Set1>;

  expectType<TypeEqual<Set1, 1 | 2>>(true);
  if (Set1.guard(one)) {
    expectType<Set1>(one);
    // @ts-expect-error
    expectNever(one);
  }
  if (Set1.guard(two)) {
    expectType<Set1>(two);
    // @ts-expect-error
    expectNever(two);
  }
  if (Set1.guard(three)) {
    expectNever(three);
  }
}

/**
 * Should guard and infer any given mixed literal
 */
{
  const set1 = [1, 'two', false] as const;
  const oneNum = 1;
  const twoNum = 2;
  const oneStr = 'one';
  const twoStr = 'two';
  const trueBool = true;
  const falseBool = false;

  const Set1 = Soit(set1);
  type Set1 = ReturnType<typeof Set1>;

  expectType<TypeEqual<Set1, 1 | 'two' | false>>(true);
  if (Set1.guard(oneNum)) {
    expectType<Set1>(oneNum);
    // @ts-expect-error
    expectNever(oneNum);
  }
  if (Set1.guard(oneStr)) {
    expectNever(oneStr);
  }
  if (Set1.guard(twoStr)) {
    expectType<Set1>(twoStr);
    // @ts-expect-error
    expectNever(twoStr);
  }
  if (Set1.guard(twoNum)) {
    expectNever(twoNum);
  }
  if (Set1.guard(falseBool)) {
    expectType<Set1>(falseBool);
    // @ts-expect-error
    expectNever(falseBool);
  }
  if (Set1.guard(trueBool)) {
    expectNever(trueBool);
  }
}

/**
 * Should guard and infer any given mixed literal
 */
{
  const set1 = [1, 'two', false] as const;
  const oneNum = 1;
  const twoNum = 2;
  const oneStr = 'one';
  const twoStr = 'two';
  const trueBool = true;
  const falseBool = false;

  const Set1 = Soit(set1);
  type Set1 = ReturnType<typeof Set1>;

  expectType<TypeEqual<Set1, 1 | 'two' | false>>(true);
  if (Set1.guard(oneNum)) {
    expectType<Set1>(oneNum);
    // @ts-expect-error
    expectNever(oneNum);
  }
  if (Set1.guard(oneStr)) {
    expectNever(oneStr);
  }
  if (Set1.guard(twoStr)) {
    expectType<Set1>(twoStr);
    // @ts-expect-error
    expectNever(twoStr);
  }
  if (Set1.guard(twoNum)) {
    expectNever(twoNum);
  }
  if (Set1.guard(falseBool)) {
    expectType<Set1>(falseBool);
    // @ts-expect-error
    expectNever(falseBool);
  }
  if (Set1.guard(trueBool)) {
    expectNever(trueBool);
  }
}

/**
 * Should guard and infer for combined iterable
 */
{
  const set1 = [1, 2] as const;
  const set2 = ['three', 'four'] as const;
  const oneNum = 1;
  const twoStr = 'two';
  const threeNum = 3;
  const fourStr = 'four';
  const trueBool = true;
  const falseBool = false;

  const Set1 = Soit(set1);
  const Set2 = Soit(set2);
  const CombinedSet = Soit([...Set1, ...Set2, true]);
  type CombinedSet = ReturnType<typeof CombinedSet>;

  expectType<TypeEqual<CombinedSet, 1 | 2 | 'three' | 'four' | true>>(true);
  if (CombinedSet.guard(oneNum)) {
    expectType<CombinedSet>(oneNum);
    // @ts-expect-error
    expectNever(oneNum);
  }
  if (CombinedSet.guard(twoStr)) {
    expectNever(twoStr);
  }
  if (CombinedSet.guard(threeNum)) {
    expectNever(threeNum);
  }
  if (CombinedSet.guard(fourStr)) {
    expectType<CombinedSet>(fourStr);
    // @ts-expect-error
    expectNever(fourStr);
  }
  if (CombinedSet.guard(falseBool)) {
    expectNever(falseBool);
  }
  if (CombinedSet.guard(trueBool)) {
    expectType<CombinedSet>(trueBool);
    // @ts-expect-error
    expectNever(trueBool);
  }
}

/**
 * Should be iterable
 */
{
  const Set1 = Soit(['one', 'two', 'three']);
  type Set1 = ReturnType<typeof Set1>;

  const set1 = Array.from(Set1);
  expectType<TypeEqual<Set1[], typeof set1>>(true);
}

/**
 * Template should be iterable
 */
{
  const Set1 = Soit(['one', 'two', 'three']);
  const Template = Soit.Template(Set1, '-', Set1);
  type Template = ReturnType<typeof Template>;

  const templatePossibleValues = Array.from(Template);
  expectType<TypeEqual<Template[], typeof templatePossibleValues>>(true);
}

/**
 * Should guard and infer for subsets
 */
{
  const Set = Soit(['one', 'two', 'three', 'four']);
  // @ts-expect-error
  const ImpossibleSubSet = Set.subset(['four', 'five']);
  const SubSet = Set.subset(['three', 'four']);
  type SubSet = ReturnType<typeof SubSet>;
  const one = 'one';
  const two = 'two';
  const three = 'three';
  const four = 'four';

  expectType<TypeEqual<SubSet, 'three' | 'four'>>(true);
  if (SubSet.guard(one)) {
    expectNever(one);
  }
  if (SubSet.guard(two)) {
    expectNever(two);
  }
  if (SubSet.guard(three)) {
    expectType<SubSet>(three);
    // @ts-expect-error
    expectNever(three);
  }
  if (SubSet.guard(four)) {
    expectType<SubSet>(four);
    // @ts-expect-error
    expectNever(four);
  }
}

/**
 * Should guard and infer for extended sets
 */
{
  const Set = Soit(['one', 'two', 'three']);
  const ExtendedSet = Set.extend(['two', 'three', 'four']);
  type ExtendedSet = ReturnType<typeof ExtendedSet>;
  const one = 'one';
  const two = 'two';
  const three = 'three';
  const four = 'four';

  expectType<TypeEqual<ExtendedSet, 'one' | 'two' | 'three' | 'four'>>(true);
  if (ExtendedSet.guard(one)) {
    expectType<ExtendedSet>(one);
    // @ts-expect-error
    expectNever(one);
  }
  if (ExtendedSet.guard(two)) {
    expectType<ExtendedSet>(two);
    // @ts-expect-error
    expectNever(two);
  }
  if (ExtendedSet.guard(three)) {
    expectType<ExtendedSet>(three);
    // @ts-expect-error
    expectNever(three);
  }
  if (ExtendedSet.guard(four)) {
    expectType<ExtendedSet>(four);
    // @ts-expect-error
    expectNever(four);
  }
}

/**
 * Should guard and infer for diff
 */
{
  const Set = Soit(['one', 'two', 'three', 'four']);
  const DifferenceSet = Set.difference(['one', 'two']);
  type DifferenceSet = ReturnType<typeof DifferenceSet>;
  const one = 'one';
  const two = 'two';
  const three = 'three';
  const four = 'four';

  expectType<TypeEqual<DifferenceSet, 'three' | 'four'>>(true);
  if (DifferenceSet.guard(one)) {
    expectNever(one);
  }
  if (DifferenceSet.guard(two)) {
    expectNever(two);
  }
  if (DifferenceSet.guard(three)) {
    expectType<DifferenceSet>(three);
    // @ts-expect-error
    expectNever(three);
  }
  if (DifferenceSet.guard(four)) {
    expectType<DifferenceSet>(four);
    // @ts-expect-error
    expectNever(four);
  }
}
