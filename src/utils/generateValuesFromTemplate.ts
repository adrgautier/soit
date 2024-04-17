import { isSoit } from './isSoit';
import {
  TemplateValue,
  TemplateValues,
  ValuesFromTemplate,
} from '../types/template.types';

function hasRestTemplate(
  template: readonly TemplateValue[]
): template is TemplateValues {
  return template.length > 0;
}

export function generateValuesFromTemplate<T extends TemplateValues>(
  template: T,
  acc: string
): string[];

export function generateValuesFromTemplate<T extends TemplateValues>(
  template: T
): ValuesFromTemplate<T>[];

export function generateValuesFromTemplate<
  T extends TemplateValues,
  A extends string,
>(template: T, acc: string = ''): any[] {
  const [t0, ...restTemplate] = template;
  if (!hasRestTemplate(restTemplate)) {
    if (isSoit(t0)) {
      return [...t0].map(value => `${acc}${value}`);
    }
    return [`${acc}${t0}`];
  }
  if (isSoit(t0)) {
    return [...t0].flatMap(value =>
      generateValuesFromTemplate(restTemplate, `${acc}${value}`)
    );
  }
  return generateValuesFromTemplate(restTemplate, `${acc}${t0}`);
}
