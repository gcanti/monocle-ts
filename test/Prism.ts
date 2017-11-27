import * as assert from 'assert'
import { Prism } from '../src'
import { eqOptions as eq } from './helpers'
import { none, some } from 'fp-ts/lib/Option'

describe('Prism', () => {
  it('fromPredicate', () => {
    const prism = Prism.fromPredicate<number>(n => n % 1 === 0)
    eq(prism.getOption(1), some(1))
    eq(prism.getOption(1.1), none)
  })

  it('some', () => {
    const prism = Prism.some<number>()
    assert.deepEqual(prism.getOption(some(1)), some(1))
    assert.deepEqual(prism.getOption(none), none)
    assert.deepEqual(prism.reverseGet(2), some(2))
  })

  it('asOptional', () => {
    const optional = Prism.some<number>().asOptional()
    assert.deepEqual(optional.getOption(some(1)), some(1))
    assert.deepEqual(optional.getOption(none), none)
    assert.deepEqual(optional.set(2)(some(1)), some(2))
    assert.deepEqual(optional.set(2)(none), none)
  })

  it('asTraversal', () => {
    const traversal = Prism.some<number>().asTraversal()
    assert.deepEqual(traversal.asSetter().set(2)(some(1)), some(2))
    assert.deepEqual(traversal.asSetter().set(2)(none), none)
  })

  it('set', () => {
    const prism = Prism.some<number>()
    assert.deepEqual(prism.set(2)(some(1)), some(2))
    assert.deepEqual(prism.set(2)(none), none)
  })
})
