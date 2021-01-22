import * as assert from 'assert'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { Iso } from '../src/Iso'
import * as _ from '../src/Ix'
import * as At from '../src/At'

describe('Index', () => {
  it('fromIso', () => {
    const iso: Iso<ReadonlyArray<string>, ReadonlyArray<number>> = {
      get: (s) => s.map((v) => +v),
      reverseGet: (a) => a.map(String)
    }
    const ix = pipe(_.indexReadonlyArray<number>(), _.fromIso(iso)).index(1)
    assert.deepStrictEqual(ix.getOption([]), O.none)
    assert.deepStrictEqual(ix.getOption(['1']), O.none)
    assert.deepStrictEqual(ix.getOption(['1', '2']), O.some(2))

    assert.deepStrictEqual(ix.replace(3)([]), [])
    assert.deepStrictEqual(ix.replace(3)(['1']), ['1'])
    assert.deepStrictEqual(ix.replace(3)(['1', '2']), ['1', '3'])
  })

  it('fromAt', () => {
    const ix = pipe(At.atReadonlyRecord<number>(), _.fromAt).index('a')

    assert.deepStrictEqual(ix.getOption({}), O.none)
    assert.deepStrictEqual(ix.getOption({ a: 1 }), O.some(1))

    assert.deepStrictEqual(ix.replace(2)({}), {})
    assert.deepStrictEqual(ix.replace(2)({ a: 1 }), { a: 2 })
  })
})
