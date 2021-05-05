import * as Benchmark from 'benchmark'
import { fromTraversable, Lens, Prism } from '../src'
import * as L from '../src/Lens'
import * as T from '../src/Traversal'
import { Traversable } from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
const PL = require('partial.lenses')
import * as O from 'optics-ts'

/*
size = 5000
prism into array (monocle-ts, stable APIs) x 1,123 ops/sec ±0.37% (87 runs sampled)
prism into array (monocle-ts, experimental APIs) x 951 ops/sec ±2.18% (86 runs sampled)
prism into array (partial.lenses) x 451,070 ops/sec ±1.17% (89 runs sampled)
prism into array (optics-ts) x 10,672 ops/sec ±2.82% (84 runs sampled)
prism modify array (monocle-ts, stable APIs) x 1,336 ops/sec ±0.61% (89 runs sampled)
prism modify array (monocle-ts, experimental APIs) x 1,251 ops/sec ±2.06% (87 runs sampled)
prism modify array (partial.lenses) x 2,191 ops/sec ±2.12% (81 runs sampled)
prism modify array (optics-ts) x 3,763 ops/sec ±0.51% (92 runs sampled)

size = 500
prism into array (monocle-ts, stable APIs) x 10,328 ops/sec ±7.12% (87 runs sampled)
prism into array (monocle-ts, experimental APIs) x 9,230 ops/sec ±0.41% (91 runs sampled)
prism into array (partial.lenses) x 466,256 ops/sec ±0.49% (86 runs sampled)
prism into array (optics-ts) x 105,339 ops/sec ±0.45% (94 runs sampled)
prism modify array (monocle-ts, stable APIs) x 13,290 ops/sec ±1.53% (82 runs sampled)
prism modify array (monocle-ts, experimental APIs) x 12,911 ops/sec ±0.64% (88 runs sampled)
prism modify array (partial.lenses) x 30,039 ops/sec ±0.45% (91 runs sampled)
prism modify array (optics-ts) x 37,777 ops/sec ±0.46% (90 runs sampled)

size = 50
prism into array (monocle-ts, stable APIs) x 95,180 ops/sec ±10.31% (89 runs sampled)
prism into array (monocle-ts, experimental APIs) x 87,631 ops/sec ±0.39% (90 runs sampled)
prism into array (partial.lenses) x 462,813 ops/sec ±0.27% (90 runs sampled)
prism into array (optics-ts) x 558,323 ops/sec ±0.46% (91 runs sampled)
prism modify array (monocle-ts, stable APIs) x 111,160 ops/sec ±0.63% (88 runs sampled)
prism modify array (monocle-ts, experimental APIs) x 113,941 ops/sec ±0.59% (86 runs sampled)
prism modify array (partial.lenses) x 200,423 ops/sec ±0.56% (87 runs sampled)
prism modify array (optics-ts) x 251,464 ops/sec ±0.37% (90 runs sampled)
*/

const suite = new Benchmark.Suite()

const size = 5000
const mid = Math.floor(size / 2)
const id = 'id-' + mid

interface Child {
  readonly id: string
  readonly name: string
}

const makeNames = (): ReadonlyArray<Child> => {
  const arr: Array<Child> = []
  for (let i = 0; i < size; i++) {
    arr.push({
      id: 'id-' + i,
      name: 'Luke-' + i
    })
  }
  return arr
}

const data = {
  a: {
    b: {
      c: { d: { e: 'hello' } }
    }
  },
  m: {
    n: {
      names: makeNames()
    }
  }
} as const

const traversalMonocleStable = Lens.fromPath<typeof data>()(['m', 'n', 'names'])
  .composeTraversal(fromTraversable(Traversable)<Child>())
  .composePrism(Prism.fromPredicate((child: Child) => child.id === id))

const foldMonocleStable = traversalMonocleStable.asFold()

const traversalMonocleExperimental = pipe(
  L.id<typeof data>(),
  L.prop('m'),
  L.prop('n'),
  L.prop('names'),
  L.traverse(Traversable),
  T.filter((child) => child.id === id)
)

const traversalPartialLenses = PL.compose(
  PL.prop('m'),
  PL.prop('n'),
  PL.prop('names'),
  PL.find((child: Child) => child.id === id)
)

const foldPartialLenses = PL.compose(traversalPartialLenses, PL.valueOr(undefined))

const traversalMonocleExperimentalModify = pipe(
  traversalMonocleExperimental,
  T.modify((s) => ({ ...s, name: nameModified }))
)

const traversalOpticsTs = O.optic<typeof data>()
  .prop('m')
  .prop('n')
  .prop('names')
  .elems()
  // `item` here has type: `NotAnArrayType<readonly Child[]>`, not sure what it means
  .when((item: any) => item.id === id)

const nameModified = 'Luke-' + mid + '-modified'
const f = (c: Child): Child => ({ ...c, name: nameModified })

suite
  .add('prism into array (monocle-ts, stable APIs)', function () {
    foldMonocleStable.headOption(data)
  })
  .add('prism into array (monocle-ts, experimental APIs)', function () {
    pipe(traversalMonocleExperimental, T.getAll(data))
  })
  .add('prism into array (partial.lenses)', function () {
    PL.get(foldPartialLenses, data)
  })
  .add('prism into array (optics-ts)', function () {
    O.preview(traversalOpticsTs)(data)
  })
  .add('prism modify array (monocle-ts, stable APIs)', function () {
    traversalMonocleStable.modify(f)(data)
  })
  .add('prism modify array (monocle-ts, experimental APIs)', function () {
    traversalMonocleExperimentalModify(data)
  })
  .add('prism modify array (partial.lenses)', function () {
    PL.modify(traversalPartialLenses, f, data)
  })
  .add('prism modify array (optics-ts)', function () {
    O.modify(traversalOpticsTs)(f as any)(data)
  })
  .on('cycle', function (event: any) {
    // tslint:disable-next-line: no-console
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    // tslint:disable-next-line: no-console
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
