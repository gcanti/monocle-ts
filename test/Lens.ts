import * as assert from 'assert'
import * as L from '../src/Lens'
import { pipe } from 'fp-ts/lib/pipeable'

type A = {
  readonly a: string
}

describe('Lens', () => {
  it('id', () => {
    const a: A = { a: 'a' }
    const lens = L.id<A>()
    assert.deepStrictEqual(lens.get(a), a)
    assert.deepStrictEqual(lens.set(a)(a), a)
  })

  it('modify', () => {
    const lens = pipe(L.id<A>(), L.prop('a'))
    const f = pipe(
      lens,
      L.modify((a) => a + a)
    )
    assert.deepStrictEqual(f({ a: 'a' }), { a: 'aa' })
  })
})
