import * as assert from 'assert'
import * as _ from '../src/At'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import * as U from './util'
import { Iso } from '../src/Iso'
import * as RR from 'fp-ts/ReadonlyRecord'
import { pipe } from 'fp-ts/function'

describe('At', () => {
  it('atReadonlyMap', () => {
    const at = _.atReadonlyMap(S.Eq)<number>().at('a')
    U.deepStrictEqual(at.get(new Map([])), O.none)
    U.deepStrictEqual(
      at.get(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      O.some(1)
    )
    U.deepStrictEqual(at.set(O.none)(new Map()), new Map())
    U.deepStrictEqual(
      at.set(O.none)(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      new Map([['b', 2]])
    )
    U.deepStrictEqual(
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
    U.deepStrictEqual(at.get(new Set()), false)
    U.deepStrictEqual(at.get(new Set(['a'])), true)
    U.deepStrictEqual(at.set(true)(new Set()), new Set(['a']))
    U.deepStrictEqual(at.set(true)(new Set(['a', 'b'])), new Set(['a', 'b']))
    U.deepStrictEqual(at.set(false)(new Set(['a', 'b'])), new Set(['b']))
  })

  it('fromIso', () => {
    const iso: Iso<Record<string, string>, Record<string, number>> = {
      get: RR.map((v) => +v),
      reverseGet: RR.map(String)
    }
    const at = pipe(_.atReadonlyRecord<number>(), _.fromIso(iso)).at('a')
    U.deepStrictEqual(at.get({}), O.none)
    U.deepStrictEqual(at.get({ a: '1' }), O.some(1))

    U.deepStrictEqual(at.set(O.none)({}), {})
    U.deepStrictEqual(at.set(O.some(1))({}), { a: '1' })
  })
})
