import { isSoit } from './isSoit';
import { escapeRegExp } from './escapeRegExp';
import { toCaptureGroup } from './toCaptureGroup';
import { TemplateValues } from '../types/template.types';

export function getRegExpFromValues(templateValues: TemplateValues) {
  return new RegExp(
    `^${templateValues
      .map(value => {
        if (isSoit(value)) {
          return toCaptureGroup(value);
        }
        return escapeRegExp(value);
      })
      .join('')}$`
  );
}
