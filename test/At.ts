import * as assert from 'assert'
import * as _ from '../src/At'
import * as O from 'fp-ts/lib/Option'
import { eqString } from 'fp-ts/lib/Eq'

describe('At', () => {
  it('atReadonlyMap', () => {
    const at = _.atReadonlyMap(eqString)<number>().at('a')
    assert.deepStrictEqual(at.get(new Map([])), O.none)
    assert.deepStrictEqual(
      at.get(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      O.some(1)
    )
    assert.deepStrictEqual(at.set(O.none)(new Map()), new Map())
    assert.deepStrictEqual(
      at.set(O.none)(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      ),
      new Map([['b', 2]])
    )
    assert.deepStrictEqual(
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
    const at = _.atReadonlySet(eqString).at('a')
    assert.deepStrictEqual(at.get(new Set()), false)
    assert.deepStrictEqual(at.get(new Set(['a'])), true)
    assert.deepStrictEqual(at.set(true)(new Set()), new Set(['a']))
    assert.deepStrictEqual(at.set(true)(new Set(['a', 'b'])), new Set(['a', 'b']))
    assert.deepStrictEqual(at.set(false)(new Set(['a', 'b'])), new Set(['b']))
  })
})
