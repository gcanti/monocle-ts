import { none, some } from 'fp-ts/lib/Option'
import { Prism } from '../src'
import { eqOptions as eq } from './helpers'

describe('Prism', () => {

  it('fromPredicate', () => {
    const prism = Prism.fromPredicate<number>(n => n % 1 === 0)
    eq(prism.getOption(1), some(1))
    eq(prism.getOption(1.1), none)
  })

})
