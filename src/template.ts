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

  function _passthrough<S extends ValuesFromTemplate<T>>(value: S): S {
    return value;
  }

  const _guardUtils = {
    guard: (testedValue: string): testedValue is ValuesFromTemplate<T> =>
       getRegExpFromValues(template).test(testedValue)
  }

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

  return Object.assign(_passthrough, _guardUtils, _iterable, _templateUtils) as SoitTemplate<T>;
}
