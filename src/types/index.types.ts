import { Soit } from './core.types';
import { SoitTemplate, ValuesFromTemplate } from './template.types';

export type Infer<S extends unknown> = // TODO: constraint S to Soit or SoitTemplate
  S extends Soit<infer V>
    ? V
    : S extends SoitTemplate<infer T>
    ? ValuesFromTemplate<T>
    : never;
