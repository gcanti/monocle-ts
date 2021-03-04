import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/ReadonlyRecord'
import * as S from 'fp-ts/string'
import * as _ from '../src/At'
import { Iso } from '../src/Iso'
import { deepStrictEqual } from './util'
import * as assert from 'assert'

describe('At', () => {
  it('fromIso', () => {
    const iso: Iso<Record<string, string>, Record<string, number>> = {
      get: R.map((v) => +v),
      reverseGet: R.map(String)
    }
    const at = pipe(_.atReadonlyRecord<number>(), _.fromIso(iso)).at('a')
    deepStrictEqual(at.get({}), O.none)
    deepStrictEqual(at.get({ a: '1' }), O.some(1))

    deepStrictEqual(at.set(O.none)({}), {})
    deepStrictEqual(at.set(O.some(1))({}), { a: '1' })
  })

  it('atReadonlyMap', () => {
    const at = _.atReadonlyMap(S.Eq)<number>().at('a')
    deepStrictEqual(at.get(new Map([])), O.none)
    deepStrictEqual(
      at.get(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      O.some(1)
    )
    deepStrictEqual(at.set(O.none)(new Map()), new Map())
    deepStrictEqual(
      at.set(O.none)(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      new Map([['b', 2]])
    )
    deepStrictEqual(
      at.set(O.some(3))(
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
    assert.strictEqual(at.set(O.some(1))(x), x)
  })

  it('atReadonlySet', () => {
    const at = _.atReadonlySet(S.Eq).at('a')
    deepStrictEqual(at.get(new Set()), false)
    deepStrictEqual(at.get(new Set(['a'])), true)
    deepStrictEqual(at.set(true)(new Set()), new Set(['a']))
    deepStrictEqual(at.set(true)(new Set(['a', 'b'])), new Set(['a', 'b']))
    deepStrictEqual(at.set(false)(new Set(['a', 'b'])), new Set(['b']))
  })
})
