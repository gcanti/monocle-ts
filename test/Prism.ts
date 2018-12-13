import * as assert from 'assert'
import { Prism } from '../src'
import { Refinement } from 'fp-ts/lib/function'
import { none, some, Option } from 'fp-ts/lib/Option'

interface A {
  type: 'A'
  a: string
}
interface B {
  type: 'B'
  b: Option<number>
}
type U = A | B

const isA: Refinement<U, A> = (u): u is A => u.type === 'A'
const isB: Refinement<U, B> = (u): u is B => u.type === 'B'

describe('Prism', () => {
  it('fromPredicate', () => {
    const prism = Prism.fromPredicate<number>(n => n % 1 === 0)
    assert.deepEqual(prism.getOption(1), some(1))
    assert.deepEqual(prism.getOption(1.1), none)
  })

  it('fromRefinement', () => {
    const prism = Prism.fromRefinement(isA)
    const toUpperCase = (a: A): A => ({ type: 'A', a: a.a.toUpperCase() })
    assert.deepEqual(prism.modify(toUpperCase)({ type: 'A', a: 'foo' }), { type: 'A', a: 'FOO' })
    assert.deepEqual(prism.modify(toUpperCase)({ type: 'B', b: some(1) }), { type: 'B', b: some(1) })
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

  it('modify', () => {
    const prism = new Prism<U, string>(s => (s.type === 'A' ? some(s.a) : none), a => ({ type: 'A', a }))
    const toUpperCase = (s: string): string => s.toUpperCase()
    assert.deepEqual(prism.modify(toUpperCase)({ type: 'A', a: 'foo' }), { type: 'A', a: 'FOO' })
    assert.deepEqual(prism.modify(toUpperCase)({ type: 'B', b: some(1) }), { type: 'B', b: some(1) })
  })

  it('compose', () => {
    const prismB = Prism.fromRefinement(isB)
    const prism = new Prism<B, number>(s => s.b, b => ({ type: 'B', b: some(b) }))
    const composition1 = prismB.compose(prism)
    const composition2 = prismB.composePrism(prism)
    assert.deepEqual(composition1.getOption({ type: 'B', b: some(1) }), some(1))
    assert.deepEqual(composition1.getOption({ type: 'B', b: none }), none)
    assert.deepEqual(composition1.getOption({ type: 'A', a: 'a' }), none)
    assert.deepEqual(composition1.reverseGet(1), { type: 'B', b: some(1) })

    assert.deepEqual(
      composition2.getOption({ type: 'B', b: some(1) }),
      composition1.getOption({ type: 'B', b: some(1) })
    )
    assert.deepEqual(composition2.getOption({ type: 'B', b: none }), composition1.getOption({ type: 'B', b: none }))
    assert.deepEqual(composition2.getOption({ type: 'A', a: 'a' }), composition1.getOption({ type: 'A', a: 'a' }))
    assert.deepEqual(composition2.reverseGet(1), composition1.reverseGet(1))
  })
})
