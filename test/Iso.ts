import * as assert from 'assert'
import * as I from '../src/Iso'

type A = {
  readonly a: string
}

describe('Iso', () => {
  it('id', () => {
    const a: A = { a: 'a' }
    const iso = I.id<A>()
    assert.deepStrictEqual(iso.get(a), a)
    assert.deepStrictEqual(iso.reverseGet(a), a)
  })

  it('reverse', () => {
    const iso = I.id<A>()
    const out = I.reverse(iso)
    assert.strictEqual(iso.get, out.reverseGet)
    assert.strictEqual(iso.reverseGet, out.get)
  })
})
