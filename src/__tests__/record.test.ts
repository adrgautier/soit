import Soit from '../index';
import { SoitRecord } from '../types/record.types';
import { TemplateValue } from '../types/template.types';

const Brands = Soit.Record({
    MS: 'Microsoft',
    AP: 'Apple'
} as const);

const Fruits = Soit(['apple', 'pear']);

// Pro tip:
// You can create a smart union that works like the getter function:

type Brands<T extends Parameters<typeof Brands>[0] = Parameters<typeof Brands>[0]> = ReturnType<typeof Brands<T>>;

// This allows to replace the enum ref

// The alias returns the union of values if nothing passed
Brands('MS')

// Know limitations: you cannot add both true and false;


const test: string = 'test';

if(Brands.guard(test)) {
    test
}

const brands = [...Brands];

const template = Soit.Template('Brand: ', Brands);

const [value ] = template.capture('Brand: Apple')
type Template = ReturnType<typeof template>;

const test2: SoitRecord = Brands;

const brand: Brands<'AP'> = 'Apple';