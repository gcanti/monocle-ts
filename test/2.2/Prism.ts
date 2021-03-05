import { Prism } from '../../src'
import { Refinement } from 'fp-ts/lib/function'
import { none, some, Option } from 'fp-ts/lib/Option'
import * as U from '../util'

interface A {
  readonly type: 'A'
  readonly a: string
}
interface B {
  readonly type: 'B'
  readonly b: Option<number>
}
type U = A | B

const isA: Refinement<U, A> = (u): u is A => u.type === 'A'
const isB: Refinement<U, B> = (u): u is B => u.type === 'B'

describe('Prism', () => {
  it('fromPredicate', () => {
    const prism = Prism.fromPredicate<number>((n) => n % 1 === 0)
    U.deepStrictEqual(prism.getOption(1), some(1))
    U.deepStrictEqual(prism.getOption(1.1), none)
  })

  it('fromRefinement', () => {
    const prism = Prism.fromPredicate(isA)
    const toUpperCase = (a: A): A => ({ type: 'A', a: a.a.toUpperCase() })
    U.deepStrictEqual(prism.modify(toUpperCase)({ type: 'A', a: 'foo' }), { type: 'A', a: 'FOO' })
    U.deepStrictEqual(prism.modify(toUpperCase)({ type: 'B', b: some(1) }), { type: 'B', b: some(1) })
  })

  it('some', () => {
    const prism = Prism.some<number>()
    U.deepStrictEqual(prism.getOption(some(1)), some(1))
    U.deepStrictEqual(prism.getOption(none), none)
    U.deepStrictEqual(prism.reverseGet(2), some(2))
  })

  it('asOptional', () => {
    const optional = Prism.some<number>().asOptional()
    U.deepStrictEqual(optional.getOption(some(1)), some(1))
    U.deepStrictEqual(optional.getOption(none), none)
    U.deepStrictEqual(optional.set(2)(some(1)), some(2))
    U.deepStrictEqual(optional.set(2)(none), none)
  })

  it('asTraversal', () => {
    const traversal = Prism.some<number>().asTraversal()
    U.deepStrictEqual(traversal.asSetter().set(2)(some(1)), some(2))
    U.deepStrictEqual(traversal.asSetter().set(2)(none), none)
  })

  it('set', () => {
    const prism = Prism.some<number>()
    U.deepStrictEqual(prism.set(2)(some(1)), some(2))
    U.deepStrictEqual(prism.set(2)(none), none)
  })

  it('modify', () => {
    const prism = new Prism<U, string>(
      (s) => (s.type === 'A' ? some(s.a) : none),
      (a) => ({ type: 'A', a })
    )
    const toUpperCase = (s: string): string => s.toUpperCase()
    U.deepStrictEqual(prism.modify(toUpperCase)({ type: 'A', a: 'foo' }), { type: 'A', a: 'FOO' })
    U.deepStrictEqual(prism.modify(toUpperCase)({ type: 'B', b: some(1) }), { type: 'B', b: some(1) })
  })

  it('compose', () => {
    const prismB = Prism.fromPredicate(isB)
    const prism = new Prism<B, number>(
      (s) => s.b,
      (b) => ({ type: 'B', b: some(b) })
    )
    const composition1 = prismB.compose(prism)
    const composition2 = prismB.composePrism(prism)
    U.deepStrictEqual(composition1.getOption({ type: 'B', b: some(1) }), some(1))
    U.deepStrictEqual(composition1.getOption({ type: 'B', b: none }), none)
    U.deepStrictEqual(composition1.getOption({ type: 'A', a: 'a' }), none)
    U.deepStrictEqual(composition1.reverseGet(1), { type: 'B', b: some(1) })

    U.deepStrictEqual(
      composition2.getOption({ type: 'B', b: some(1) }),
      composition1.getOption({ type: 'B', b: some(1) })
    )
    U.deepStrictEqual(composition2.getOption({ type: 'B', b: none }), composition1.getOption({ type: 'B', b: none }))
    U.deepStrictEqual(composition2.getOption({ type: 'A', a: 'a' }), composition1.getOption({ type: 'A', a: 'a' }))
    U.deepStrictEqual(composition2.reverseGet(1), composition1.reverseGet(1))
  })
})
