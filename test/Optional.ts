import { Option, none, some } from 'fp-ts/lib/Option'
import { Optional } from '../src'
import { eqOptions as eq } from './helpers'

type A = {
  a: Option<number>
}

const optional = Optional.fromProp<A, 'a'>('a')

describe('Optional', () => {

  it('getOption', () => {
    eq(optional.getOption({ a: none }), none)
  })

  it('set', () => {
    eq(optional.set(none, { a: some(1) }).a, none)
    eq(optional.set(some(2), { a: some(1) }).a, some(2))
  })

})
