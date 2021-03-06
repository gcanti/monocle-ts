import { pipe } from 'fp-ts/lib/pipeable'
import * as _ from '../src/Iso'
import * as L from '../src/Lens'
import * as P from '../src/Prism'
import * as Op from '../src/Optional'
import * as T from '../src/Traversal'
import * as Id from 'fp-ts/lib/Identity'
import * as RA from 'fp-ts/lib/ReadonlyArray'
import * as O from 'fp-ts/lib/Option'
import * as U from './util'

const numberFromString: _.Iso<number, string> = {
  get: String,
  reverseGet: parseFloat
}

const double: _.Iso<number, number> = {
  get: (n) => n * 2,
  reverseGet: (n) => n / 2
}

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
      const sb = _.categoryIso.compose(numberFromString, double)
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
    U.deepStrictEqual(sb.set(2)({ a: O.none }), { a: O.none })
    U.deepStrictEqual(sb.set(2)({ a: O.some(1) }), { a: O.some(2) })
  })

  it('composeTraversal', () => {
    type S = ReadonlyArray<number>
    const sa = _.id<S>()
    const ab = pipe(T.id<S>(), T.traverse(RA.readonlyArray))
    const sb = pipe(sa, _.composeTraversal(ab))
    U.deepStrictEqual(sb.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })

  it('asTraversal', () => {
    const sa = pipe(double, _.asTraversal)
    U.deepStrictEqual(sa.modifyF(Id.identity)((n) => n - 1)(3), 2.5)
  })

  it('modifyF', () => {
    const f = pipe(
      double,
      _.modifyF(O.option)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    U.deepStrictEqual(f(1), O.some(2))
    U.deepStrictEqual(f(-1), O.none)
  })
})
