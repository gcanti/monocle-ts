import * as assert from 'assert'
import * as Id from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { increment, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import * as _ from '../src/Iso'
import * as L from '../src/Lens'
import * as Op from '../src/Optional'
import * as P from '../src/Prism'
import * as T from '../src/Traversal'
import * as U from './util'

const numberFromString: _.Iso<number, string> = _.iso(String, parseFloat)

const double: _.Iso<number, number> = _.iso(
  (n) => n * 2,
  (n) => n / 2
)

describe('Iso', () => {
  describe('pipeables', () => {
    it('imap', () => {
      const sb = pipe(
        numberFromString,
        _.imap(
          (s) => '+' + s,
          (s) => s.substring(1)
        )
      )
      U.deepStrictEqual(sb.get(1), '+1')
      U.deepStrictEqual(sb.reverseGet('+1'), 1)
    })
  })

  describe('instances', () => {
    it('compose', () => {
      const sb = _.Category.compose(numberFromString)(double)
      U.deepStrictEqual(sb.get(1), '2')
      U.deepStrictEqual(sb.reverseGet('2'), 1)
    })
  })

  it('id', () => {
    const ss = _.id<number>()
    U.deepStrictEqual(ss.get(1), 1)
    U.deepStrictEqual(ss.reverseGet(1), 1)
  })

  it('reverse', () => {
    const as = _.reverse(numberFromString)
    U.deepStrictEqual(as.get('1'), 1)
    U.deepStrictEqual(as.reverseGet(1), '1')
  })

  it('compose', () => {
    const sa = double
    const ab = numberFromString
    const sb = pipe(sa, _.compose(ab))
    U.deepStrictEqual(sb.get(1), '2')
    U.deepStrictEqual(sb.reverseGet('2'), 1)
  })

  it('composeLens', () => {
    type S = { readonly a: number }
    const sa = _.id<S>()
    const ab = pipe(L.id<S>(), L.prop('a'))
    const sb = pipe(sa, _.composeLens(ab))
    U.deepStrictEqual(sb.get({ a: 1 }), 1)
    U.deepStrictEqual(sb.set(2)({ a: 1 }), { a: 2 })
  })

  it('composePrism', () => {
    type S = O.Option<number>
    const sa = _.id<S>()
    const ab = pipe(P.id<S>(), P.some)
    const sb = pipe(sa, _.composePrism(ab))
    U.deepStrictEqual(sb.getOption(O.none), O.none)
    U.deepStrictEqual(sb.getOption(O.some(1)), O.some(1))
    U.deepStrictEqual(sb.reverseGet(1), O.some(1))
  })

  it('composeOptional', () => {
    type S = { readonly a: O.Option<number> }
    const sa = _.id<S>()
    const ab = pipe(Op.id<S>(), Op.prop('a'), Op.some)
    const sb = pipe(sa, _.composeOptional(ab))
    U.deepStrictEqual(sb.getOption({ a: O.none }), O.none)
    U.deepStrictEqual(sb.getOption({ a: O.some(1) }), O.some(1))
    U.deepStrictEqual(sb.replace(2)({ a: O.none }), { a: O.none })
    U.deepStrictEqual(sb.replace(2)({ a: O.some(1) }), { a: O.some(2) })
  })

  it('composeTraversal', () => {
    type S = ReadonlyArray<number>
    const sa = _.id<S>()
    const ab = pipe(T.id<S>(), T.traverse(RA.Traversable))
    const sb = pipe(sa, _.composeTraversal(ab))
    U.deepStrictEqual(sb.modifyF(Id.Applicative)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })

  it('asTraversal', () => {
    const sa = pipe(double, _.asTraversal)
    U.deepStrictEqual(sa.modifyF(Id.Applicative)((n) => n - 1)(3), 2.5)
  })

  it('modifyF', () => {
    const f = pipe(
      double,
      _.modifyF(O.Applicative)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    U.deepStrictEqual(f(1), O.some(2))
    U.deepStrictEqual(f(-1), O.none)
  })

  it('fromNullable', () => {
    type S = { readonly a: number } | null
    type A = readonly [number] | null
    const sa: _.Iso<S, A> = _.iso(
      (s) => (s === null ? null : ([s.a] as const)),
      (a) => (a === null ? null : { a: a[0] })
    )
    const prism = _.fromNullable(sa)
    U.deepStrictEqual(prism.getOption(null), O.none)
    U.deepStrictEqual(prism.getOption({ a: 1 }), O.some([1] as const))
    U.deepStrictEqual(prism.reverseGet([1]), { a: 1 })
  })

  it('filter', () => {
    type S = { readonly a: number }
    type A = readonly [number]
    const sa: _.Iso<S, A> = _.iso(
      (s) => [s.a] as const,
      (a) => ({ a: a[0] })
    )
    const prism = pipe(
      sa,
      _.filter((a) => a[0] > 0)
    )
    U.deepStrictEqual(prism.getOption({ a: -1 }), O.none)
    U.deepStrictEqual(prism.getOption({ a: 1 }), O.some([1] as const))
    U.deepStrictEqual(prism.reverseGet([1]), { a: 1 })
    U.deepStrictEqual(prism.reverseGet([-1]), { a: -1 })
  })

  it('prop', () => {
    type S = readonly [number]
    type A = { readonly a: number }
    const sa: _.Iso<S, A> = _.iso(
      (s) => ({ a: s[0] }),
      (a) => [a.a]
    )
    const lens = pipe(sa, _.prop('a'))
    U.deepStrictEqual(lens.get([1]), 1)
    U.deepStrictEqual(lens.set(2)([1]), [2])
  })

  it('props', () => {
    type S = readonly [number, string]
    type A = { readonly a: number; readonly b: string }
    const sa: _.Iso<S, A> = _.iso(
      (s) => ({ a: s[0], b: s[1] }),
      (a) => [a.a, a.b]
    )
    const lens = pipe(sa, _.props('a', 'b'))
    U.deepStrictEqual(lens.get([1, 'b']), { a: 1, b: 'b' })
    U.deepStrictEqual(lens.set({ a: 2, b: 'c' })([1, 'b']), [2, 'c'])
  })

  it('component', () => {
    type S = { readonly a: number; readonly b: string }
    type A = readonly [number, string]
    const sa: _.Iso<S, A> = _.iso(
      (s) => [s.a, s.b] as const,
      (a) => ({ a: a[0], b: a[1] })
    )
    const lens = pipe(sa, _.component(1))
    U.deepStrictEqual(lens.get({ a: 1, b: 'b' }), 'b')
    U.deepStrictEqual(lens.set('c')({ a: 1, b: 'b' }), { a: 1, b: 'c' })
  })

  it('index', () => {
    type S = { readonly a: ReadonlyArray<number> }
    type A = ReadonlyArray<number>
    const sa: _.Iso<S, A> = _.iso(
      (s) => s.a,
      (a) => ({ a })
    )
    const optional = pipe(sa, _.index(0))
    U.deepStrictEqual(optional.getOption({ a: [] }), O.none)
    U.deepStrictEqual(optional.getOption({ a: [1] }), O.some(1))
    U.deepStrictEqual(optional.replace(2)({ a: [] }), { a: [] })
    U.deepStrictEqual(optional.replace(2)({ a: [1] }), { a: [2] })
    // should return the same reference
    const empty: S = { a: [] }
    const full: S = { a: [1] }
    assert.strictEqual(optional.replace(1)(empty), empty)
    assert.strictEqual(optional.replace(1)(full), full)
  })

  it('indexNonEmpty', () => {
    type S = { readonly a: ReadonlyNonEmptyArray<number> }
    type A = ReadonlyNonEmptyArray<number>
    const sa: _.Iso<S, A> = _.iso(
      (s) => s.a,
      (a) => ({ a })
    )
    const optional = pipe(sa, _.indexNonEmpty(1))
    U.deepStrictEqual(optional.getOption({ a: [1] }), O.none)
    U.deepStrictEqual(optional.getOption({ a: [1, 2] }), O.some(2))
    U.deepStrictEqual(optional.replace(3)({ a: [1] }), { a: [1] })
    U.deepStrictEqual(optional.replace(3)({ a: [1, 2] }), { a: [1, 3] })
    // should return the same reference
    const s: S = { a: [1, 2] }
    assert.strictEqual(optional.replace(2)(s), s)
  })

  it('key', () => {
    type S = { readonly a: ReadonlyRecord<string, number> }
    type A = ReadonlyRecord<string, number>
    const sa: _.Iso<S, A> = _.iso(
      (s) => s.a,
      (a) => ({ a })
    )
    const optional = pipe(sa, _.key('b'))
    U.deepStrictEqual(optional.getOption({ a: {} }), O.none)
    U.deepStrictEqual(optional.getOption({ a: { b: 1 } }), O.some(1))
    U.deepStrictEqual(optional.replace(2)({ a: {} }), { a: {} })
    U.deepStrictEqual(optional.replace(2)({ a: { b: 1 } }), { a: { b: 2 } })
  })

  it('atKey', () => {
    type S = { readonly a: ReadonlyRecord<string, number> }
    type A = ReadonlyRecord<string, number>
    const sa: _.Iso<S, A> = _.iso(
      (s) => s.a,
      (a) => ({ a })
    )
    const optional = pipe(sa, _.atKey('b'))
    U.deepStrictEqual(optional.get({ a: {} }), O.none)
    U.deepStrictEqual(optional.get({ a: { b: 1 } }), O.some(1))
    U.deepStrictEqual(optional.set(O.none)({ a: {} }), { a: {} })
    U.deepStrictEqual(optional.set(O.some(1))({ a: {} }), { a: { b: 1 } })
    U.deepStrictEqual(optional.set(O.none)({ a: { b: 1 } }), { a: {} })
    U.deepStrictEqual(optional.set(O.some(2))({ a: { b: 1 } }), { a: { b: 2 } })
  })

  it('traverse', () => {
    type S = { readonly a: ReadonlyArray<number> }
    type A = ReadonlyArray<number>
    const sa: _.Iso<S, A> = _.iso(
      (s) => s.a,
      (a) => ({ a })
    )
    const traversal = pipe(sa, _.traverse(RA.Traversable))
    U.deepStrictEqual(traversal.modifyF(Id.Applicative)((n) => n * 2)({ a: [1, 2, 3] }), { a: [2, 4, 6] })
  })

  it('findFirst', () => {
    type S = { readonly a: ReadonlyArray<number> }
    type A = ReadonlyArray<number>
    const sa: _.Iso<S, A> = _.iso(
      (s) => s.a,
      (a) => ({ a })
    )
    const optional = pipe(
      sa,
      _.findFirst((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption({ a: [] }), O.none)
    U.deepStrictEqual(optional.getOption({ a: [-1] }), O.none)
    U.deepStrictEqual(optional.getOption({ a: [-1, 2] }), O.some(2))
    U.deepStrictEqual(optional.replace(1)({ a: [] }), { a: [] })
    U.deepStrictEqual(optional.replace(1)({ a: [-1] }), { a: [-1] })
    U.deepStrictEqual(optional.replace(3)({ a: [-1, 2] }), { a: [-1, 3] })
  })

  it('findFirstNonEmpty', () => {
    type S = { readonly a: ReadonlyNonEmptyArray<number> }
    type A = ReadonlyNonEmptyArray<number>
    const sa: _.Iso<S, A> = _.iso(
      (s) => s.a,
      (a) => ({ a })
    )
    const optional = pipe(
      sa,
      _.findFirstNonEmpty((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption({ a: [-1] }), O.none)
    U.deepStrictEqual(optional.getOption({ a: [-1, 2] }), O.some(2))
    U.deepStrictEqual(optional.replace(1)({ a: [-1] }), { a: [-1] })
    U.deepStrictEqual(optional.replace(3)({ a: [-1, 2] }), { a: [-1, 3] })
  })

  it('modify', () => {
    assert.strictEqual(pipe(double, _.modify(increment))(1000), 1000.5)
  })
})
