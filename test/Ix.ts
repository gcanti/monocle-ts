import * as assert from 'assert'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import * as At from '../src/At'
import { Iso } from '../src/Iso'
import * as _ from '../src/Ix'
import * as U from './util'

describe('Ix', () => {
  it('indexReadonlyMap', () => {
    const index = _.indexReadonlyMap(S.Eq)<number>().index('a')
    U.deepStrictEqual(index.getOption(new Map([])), O.none)
    U.deepStrictEqual(
      index.getOption(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      O.some(1)
    )
    U.deepStrictEqual(index.replace(3)(new Map([['b', 2]])), new Map([['b', 2]]))
    U.deepStrictEqual(
      index.replace(3)(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      new Map([
        ['a', 3],
        ['b', 2]
      ])
    )
    // should return the same reference if nothing changed
    const x = new Map([
      ['a', 1],
      ['b', 2]
    ])
    assert.strictEqual(index.replace(1)(x), x)
  })

  it('fromIso', () => {
    const iso: Iso<ReadonlyArray<string>, ReadonlyArray<number>> = {
      get: (s) => s.map((v) => +v),
      reverseGet: (a) => a.map(String)
    }
    const ix = pipe(_.indexReadonlyArray<number>(), _.fromIso(iso)).index(1)
    U.deepStrictEqual(ix.getOption([]), O.none)
    U.deepStrictEqual(ix.getOption(['1']), O.none)
    U.deepStrictEqual(ix.getOption(['1', '2']), O.some(2))

    U.deepStrictEqual(ix.replace(3)([]), [])
    U.deepStrictEqual(ix.replace(3)(['1']), ['1'])
    U.deepStrictEqual(ix.replace(3)(['1', '2']), ['1', '3'])
  })

  it('fromAt', () => {
    const ix = pipe(At.atReadonlyRecord<number>(), _.fromAt).index('a')

    U.deepStrictEqual(ix.getOption({}), O.none)
    U.deepStrictEqual(ix.getOption({ a: 1 }), O.some(1))

    U.deepStrictEqual(ix.replace(2)({}), {})
    U.deepStrictEqual(ix.replace(2)({ a: 1 }), { a: 2 })
  })
})
