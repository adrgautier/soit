import Benchmark, { Event } from 'benchmark';
import { expectType } from 'ts-expect';
import * as z from 'zod';
import Soit from '../src/index';

const isWarmColor = Soit(['red', 'orange', 'yellow']);

const abstractColorItemSchema = z.object({
  base: z.object({
    name: z.string(),
    value: z.string(),
  }),
  advanced: z.object({
    description: z.string(),
  }),
});

const warmColorItemSchema = abstractColorItemSchema.extend({
  base: z.object({
    name: z.enum(['red', 'orange', 'yellow']),
    value: z.string(),
  }),
});

const coldColorItemSchema = abstractColorItemSchema.extend({
  base: z.object({
    name: z.enum(['blue', 'cyan', 'green']),
    value: z.string(),
  }),
});

const colorItemSchema = z.union([warmColorItemSchema, coldColorItemSchema]);

type WarmColorItem = z.infer<typeof warmColorItemSchema>;
type ColorItem = z.infer<typeof colorItemSchema>;

const colorItem = {
  base: {
    name: 'red',
    value: '#FF0000',
  },
  advanced: {
    description: 'Roses are red...',
  },
} as ColorItem;

var suite = new Benchmark.Suite();

suite
  .add('zod', function () {
    // @ts-expect-error
    expectType<WarmColorItem>(colorItem);
    if (warmColorItemSchema.check(colorItem)) {
      expectType<WarmColorItem>(colorItem);
    }
  })
  .add('soit', function () {
    // @ts-expect-error
    expectType<WarmColorItem>(colorItem);
    if (isWarmColor(colorItem, 'base.name')) {
      expectType<WarmColorItem>(colorItem);
    }
  })
  // add listeners
  .on('cycle', function (event: Event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + suite.filter('fastest').map('name'));
  })
  // run async
  .run({ async: true });
