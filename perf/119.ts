import * as Benchmark from 'benchmark'
import { fromTraversable, Lens, Prism } from '../src'
import * as L from '../src/Lens'
import * as T from '../src/Traversal'
import { Traversable } from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
const PL = require('partial.lenses')

/*
prism into array (monocle-ts, stable APIs) x 1,175 ops/sec ±0.47% (87 runs sampled)
prism into array (monocle-ts, experimental APIs) x 993 ops/sec ±3.09% (87 runs sampled)
prism into array (partial.lenses) x 455,961 ops/sec ±3.38% (89 runs sampled)
prism modify array (monocle-ts, stable APIs) x 32.04 ops/sec ±0.28% (54 runs sampled)
prism modify array (monocle-ts, experimental APIs) x 31.86 ops/sec ±1.03% (54 runs sampled)
prism modify array (partial.lenses) x 2,315 ops/sec ±1.06% (89 runs sampled)
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

const nameModified = 'Luke-' + mid + '-modified'

const traversalMonocleExperimentalModify = pipe(
  traversalMonocleExperimental,
  T.modify((s) => ({ ...s, name: nameModified }))
)

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
  .add('prism modify array (monocle-ts, stable APIs)', function () {
    traversalMonocleStable.modify((s) => ({ ...s, name: nameModified }))(data)
  })
  .add('prism modify array (monocle-ts, experimental APIs)', function () {
    traversalMonocleExperimentalModify(data)
  })
  .add('prism modify array (partial.lenses)', function () {
    PL.modify(traversalPartialLenses, (s: Child) => ({ ...s, name: nameModified }), data)
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
