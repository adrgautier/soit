import { ArrayUtils } from './types/core.types';
import {
  SoitTemplate,
  TemplateUtils,
  TemplateValues,
  ValuesFromTemplate,
} from './types/template.types';
import { generateValuesFromTemplate } from './utils/generateValuesFromTemplate';
import { getRegExpFromValues } from './utils/getRegExpFromValues';
import { isSoit } from './utils/isSoit';

export function _soitTemplate<T extends TemplateValues>(
  ...template: T
): SoitTemplate<T> {
  const _set = new Set<ValuesFromTemplate<T>>(
    generateValuesFromTemplate(template)
  );

  const _values = Array.from(_set);

  function _guard(testedValue: string): testedValue is ValuesFromTemplate<T> {
    return getRegExpFromValues(template).test(testedValue);
  }

  const _arrayUtils: ArrayUtils<ValuesFromTemplate<T>> = {
    forEach: (...args) => _values.forEach(...args),
    map: (...args) => _values.map(...args),
  };

  const _templateUtils: TemplateUtils<T> = {
    capture: (testedValue: string) => {
      const result = getRegExpFromValues(template).exec(testedValue);

      if (result === null) {
        return null;
      }

      const captureGroupCount = template.filter(isSoit).length;

      let captures: any = [];

      for (let i = 1; i <= captureGroupCount; i++) {
        captures.push(result[i]);
      }

      return captures;
    },
  };

  const _iterable: Iterable<ValuesFromTemplate<T>> = {
    [Symbol.iterator]: () => _set[Symbol.iterator](),
  };

  return Object.assign(_guard, _iterable, _arrayUtils, _templateUtils);
}
