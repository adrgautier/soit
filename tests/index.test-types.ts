/**
 * This file is not a regular test file.
 * In order for those tests to be validated,
 * the file needs to compile without error.
 */
import { expectType, expectNever, TypeEqual } from 'ts-expect';
import Soit, { Infer, assert } from '../src/index';

/**
 * Should prevent unknown literals array
 */
{
  const set1 = ['one', 'two'];
  const one = 'one';

  // @ts-expect-error
  const isSet1 = Soit(set1);
  type Set1 = Infer<typeof isSet1>;

  expectType<TypeEqual<Set1, never>>(true);
  if (isSet1(one)) {
    expectNever(one);
  }
}

/**
 * Should prevent unknown object inference
 */
{
  const randomFunction = () => {};
  const randomArray = [''];
  const randomObject = {};
  const randomString = '';

  // @ts-expect-error
  type Fail1 = Infer<typeof randomFunction>;

  // @ts-expect-error
  type Fail2 = Infer<typeof randomArray>;

  // @ts-expect-error
  type Fail3 = Infer<typeof randomObject>;

  // @ts-expect-error
  type Fail4 = Infer<typeof randomString>;
}

/**
 * Should guard, assert and infer any given string literal
 */
{
  const set1 = ['one', 'two'] as const;
  const one = 'one';
  const two = 'two';
  const three = 'three';

  const isSet1 = Soit(set1);
  type Set1 = Infer<typeof isSet1>;

  expectType<TypeEqual<Set1, 'one' | 'two'>>(true);
  if (isSet1(one)) {
    expectType<Set1>(one);
    // @ts-expect-error
    expectNever(one);
  }
  if (isSet1(two)) {
    expectType<Set1>(two);
    // @ts-expect-error
    expectNever(two);
  }
  if (isSet1(three)) {
    expectNever(three);
  }

  //assert(isSet1, three);
  isSet1.assert(three)
  three
}

/**
 * Should guard and infer any given number literal
 */
{
  const set1 = [1, 2] as const;
  const one = 1;
  const two = 2;
  const three = 3;

  const isSet1 = Soit(set1);
  type Set1 = Infer<typeof isSet1>;

  expectType<TypeEqual<Set1, 1 | 2>>(true);
  if (isSet1(one)) {
    expectType<Set1>(one);
    // @ts-expect-error
    expectNever(one);
  }
  if (isSet1(two)) {
    expectType<Set1>(two);
    // @ts-expect-error
    expectNever(two);
  }
  if (isSet1(three)) {
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

  const isSet1 = Soit(set1);
  type Set1 = Infer<typeof isSet1>;

  expectType<TypeEqual<Set1, 1 | 'two' | false>>(true);
  if (isSet1(oneNum)) {
    expectType<Set1>(oneNum);
    // @ts-expect-error
    expectNever(oneNum);
  }
  if (isSet1(oneStr)) {
    expectNever(oneStr);
  }
  if (isSet1(twoStr)) {
    expectType<Set1>(twoStr);
    // @ts-expect-error
    expectNever(twoStr);
  }
  if (isSet1(twoNum)) {
    expectNever(twoNum);
  }
  if (isSet1(falseBool)) {
    expectType<Set1>(falseBool);
    // @ts-expect-error
    expectNever(falseBool);
  }
  if (isSet1(trueBool)) {
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

  const isSet1 = Soit(set1);
  type Set1 = Infer<typeof isSet1>;

  expectType<TypeEqual<Set1, 1 | 'two' | false>>(true);
  if (isSet1(oneNum)) {
    expectType<Set1>(oneNum);
    // @ts-expect-error
    expectNever(oneNum);
  }
  if (isSet1(oneStr)) {
    expectNever(oneStr);
  }
  if (isSet1(twoStr)) {
    expectType<Set1>(twoStr);
    // @ts-expect-error
    expectNever(twoStr);
  }
  if (isSet1(twoNum)) {
    expectNever(twoNum);
  }
  if (isSet1(falseBool)) {
    expectType<Set1>(falseBool);
    // @ts-expect-error
    expectNever(falseBool);
  }
  if (isSet1(trueBool)) {
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

  const isSet1 = Soit(set1);
  const isSet2 = Soit(set2);
  const isCombinedSet = Soit([...isSet1, ...isSet2, true]);
  type CombinedSet = Infer<typeof isCombinedSet>;

  expectType<TypeEqual<CombinedSet, 1 | 2 | 'three' | 'four' | true>>(true);
  if (isCombinedSet(oneNum)) {
    expectType<CombinedSet>(oneNum);
    // @ts-expect-error
    expectNever(oneNum);
  }
  if (isCombinedSet(twoStr)) {
    expectNever(twoStr);
  }
  if (isCombinedSet(threeNum)) {
    expectNever(threeNum);
  }
  if (isCombinedSet(fourStr)) {
    expectType<CombinedSet>(fourStr);
    // @ts-expect-error
    expectNever(fourStr);
  }
  if (isCombinedSet(falseBool)) {
    expectNever(falseBool);
  }
  if (isCombinedSet(trueBool)) {
    expectType<CombinedSet>(trueBool);
    // @ts-expect-error
    expectNever(trueBool);
  }
}

/**
 * Sould be iterable
 */
{
  const isSet1 = Soit(['one', 'two', 'three']);
  type Set1 = Infer<typeof isSet1>;

  const set1 = Array.from(isSet1);
  expectType<TypeEqual<Set1[], typeof set1>>(true);
}

/**
 * Should expose map and forEach
 */
{
  const isSet1 = Soit(['one', 'two', 'three']);
  const isSet2 = Soit(['two', 'three', 'four']);
  const isCombinedSet = Soit([...isSet1, ...isSet2]);
  type CombinedSet = Infer<typeof isCombinedSet>;

  isCombinedSet.map(value => {
    expectType<CombinedSet>(value);
    // @ts-expect-error
    expectNever(value);
  });

  isCombinedSet.forEach(value => {
    expectType<CombinedSet>(value);
    // @ts-expect-error
    expectNever(value);
  });
}

/**
 * Should guard and infer for subsets
 */
{
  const isSet = Soit(['one', 'two', 'three', 'four']);
  // @ts-expect-error
  const isImpossibleSubSet = isSet.subset(['four', 'five']);
  const isSubSet = isSet.subset(['three', 'four']);
  type SubSet = Infer<typeof isSubSet>;
  const one = 'one';
  const two = 'two';
  const three = 'three';
  const four = 'four';

  expectType<TypeEqual<SubSet, 'three' | 'four'>>(true);
  if (isSubSet(one)) {
    expectNever(one);
  }
  if (isSubSet(two)) {
    expectNever(two);
  }
  if (isSubSet(three)) {
    expectType<SubSet>(three);
    // @ts-expect-error
    expectNever(three);
  }
  if (isSubSet(four)) {
    expectType<SubSet>(four);
    // @ts-expect-error
    expectNever(four);
  }
}

/**
 * Should guard and infer for extended sets
 */
{
  const isSet = Soit(['one', 'two', 'three']);
  const isExtendedSet = isSet.extend(['two', 'three', 'four']);
  type ExtendedSet = Infer<typeof isExtendedSet>;
  const one = 'one';
  const two = 'two';
  const three = 'three';
  const four = 'four';

  expectType<TypeEqual<ExtendedSet, 'one' | 'two' | 'three' | 'four'>>(true);
  if (isExtendedSet(one)) {
    expectType<ExtendedSet>(one);
    // @ts-expect-error
    expectNever(one);
  }
  if (isExtendedSet(two)) {
    expectType<ExtendedSet>(two);
    // @ts-expect-error
    expectNever(two);
  }
  if (isExtendedSet(three)) {
    expectType<ExtendedSet>(three);
    // @ts-expect-error
    expectNever(three);
  }
  if (isExtendedSet(four)) {
    expectType<ExtendedSet>(four);
    // @ts-expect-error
    expectNever(four);
  }
}

/**
 * Should guard and infer for diff
 */
{
  const isSet = Soit(['one', 'two', 'three', 'four']);
  const isDifferenceSet = isSet.difference(['one', 'two']);
  type DifferenceSet = Infer<typeof isDifferenceSet>;
  const one = 'one';
  const two = 'two';
  const three = 'three';
  const four = 'four';

  expectType<TypeEqual<DifferenceSet, 'three' | 'four'>>(true);
  if (isDifferenceSet(one)) {
    expectNever(one);
  }
  if (isDifferenceSet(two)) {
    expectNever(two);
  }
  if (isDifferenceSet(three)) {
    expectType<DifferenceSet>(three);
    // @ts-expect-error
    expectNever(three);
  }
  if (isDifferenceSet(four)) {
    expectType<DifferenceSet>(four);
    // @ts-expect-error
    expectNever(four);
  }
}

/**
 * Should guard and infer object first level prop
 */
{
  const isSet = Soit(['one']);

  type Valid = {
    level1: 'one';
  };

  const shouldBeValid = {
    level1: 'one',
  };

  const shouldBeInvalid = {
    level1: 1,
  };

  // @ts-expect-error
  expectType<Valid>(shouldBeValid);
  if (isSet(shouldBeValid, 'level1')) {
    expectType<Valid>(shouldBeValid);
  }

  if (isSet(shouldBeInvalid, 'level1')) {
    expectNever(shouldBeInvalid);
  }
  // @ts-expect-error
  isSet(shouldBeValid, 'level2');
}

/**
 * Should guard and infer object second level prop
 */
{
  const isSet = Soit(['one']);

  type Valid = {
    level1: {
      level2: 'one';
    };
  };

  const shouldBeValid = {
    level1: {
      level2: 'one',
    },
  };

  const shouldBeInvalid = {
    level1: {
      level2: 1,
    },
  };

  // @ts-expect-error
  expectType<Valid>(shouldBeValid);
  if (isSet(shouldBeValid, 'level1.level2')) {
    expectType<Valid>(shouldBeValid);
  }

  if (isSet(shouldBeInvalid, 'level1.level2')) {
    // should be never but inference is too week
    // @ts-expect-error
    expectNever(shouldBeInvalid);
  }
  // @ts-expect-error
  isSet(shouldBeValid, 'level2.level1');
}

/**
 * Should guard and infer object third level prop
 */
{
  const isSet = Soit(['one']);

  type Valid = {
    level1: {
      level2: {
        level3: 'one';
      };
    };
  };

  const shouldBeValid = {
    level1: {
      level2: {
        level3: 'one',
      },
    },
  };

  const shouldBeInvalid = {
    level1: {
      level2: {
        level3: 1,
      },
    },
  };

  // @ts-expect-error
  expectType<Valid>(shouldBeValid);
  if (isSet(shouldBeValid, 'level1.level2.level3')) {
    expectType<Valid>(shouldBeValid);
  }

  if (isSet(shouldBeInvalid, 'level1.level2.level3')) {
    // should be never but inference is too week
    // @ts-expect-error
    expectNever(shouldBeInvalid);
  }
  //@ts-expect-error
  isSet(shouldBeValid, 'level3.level2.level1');
}
/**
 * Should guard and infer object fourth level prop
 */
{
  const isSet = Soit(['one']);

  type Valid = {
    level1: {
      level2: {
        level3: {
          level4: 'one';
        };
      };
    };
  };

  const shouldBeValid = {
    level1: {
      level2: {
        level3: {
          level4: 'one',
        },
      },
    },
  };

  const shouldBeInvalid = {
    level1: {
      level2: {
        level3: {
          level4: 1,
        },
      },
    },
  };

  // @ts-expect-error
  expectType<Valid>(shouldBeValid);
  if (isSet(shouldBeValid, 'level1.level2.level3.level4')) {
    expectType<Valid>(shouldBeValid);
  }

  if (isSet(shouldBeInvalid, 'level1.level2.level3.level4')) {
    // should be never but inference is too week
    // @ts-expect-error
    expectNever(shouldBeInvalid);
  }
  //@ts-expect-error
  isSet(shouldBeValid, 'level4.level3.level2.level1');
}
