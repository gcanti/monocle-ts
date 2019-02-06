import * as assert from 'assert'
import { update } from '../src'

describe('update', () => {
  it('updates an object without mutating the original', () => {
    const orig = { a: 1, b: 2 }
    const updated = update(orig, 'a', 2)
    assert.deepStrictEqual(updated, { a: 2, b: 2 })
    assert.deepStrictEqual(orig.a, 1)
  })
  it('returns previous value if noop', () => {
    const orig = { a: 2, b: 2 }
    assert.strictEqual(update(orig, 'a', 2), orig)
  })
})
