import { Option, none, some } from 'fp-ts/lib/Option'
import { Optional } from '../src'
import { eqOptions as eq } from './helpers'

type A = {
  a: Option<number>
}

const optional = new Optional<A, number>(
  s => s.a,
  (a, s) => s.a.fold<A>(() => s, () => ({ ...s, a: some(a) }))
)

describe('Optional', () => {

  it('getOption', () => {
    eq(optional.getOption({ a: none }), none)
    eq(optional.getOption({ a: some(1) }), some(1))
  })

  it('set', () => {
    eq(optional.set(2, { a: some(1) }).a, some(2))
  })

})
