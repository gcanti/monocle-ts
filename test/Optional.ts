import * as assert from 'assert'
import * as Id from 'fp-ts/lib/Identity'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/ReadonlyArray'
import { ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import * as L from '../src/Lens'
import * as _ from '../src/Optional'
import * as P from '../src/Prism'
import * as T from '../src/Traversal'
import * as U from './util'

type S = O.Option<{
  readonly a: string
  readonly b: number
  readonly c: boolean
}>

describe('Optional', () => {
  describe('pipeables', () => {
    it('imap', () => {
      const sa = pipe(
        pipe(_.id<S>(), _.some, _.prop('b')),
        _.imap(
          (n) => String(n),
          (s) => parseFloat(s)
        )
      )
      U.deepStrictEqual(sa.getOption(O.none), O.none)
      U.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('1'))
      U.deepStrictEqual(sa.set('2')(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 2, c: true }))
    })
  })

  it('compose', () => {
    type S = O.Option<O.Option<number>>
    const sa = pipe(_.id<S>(), _.some)
    const ab = pipe(_.id<O.Option<number>>(), _.some)
    const sb = _.categoryOptional.compose(ab, sa)
    U.deepStrictEqual(sb.getOption(O.none), O.none)
    U.deepStrictEqual(sb.getOption(O.some(O.none)), O.none)
    U.deepStrictEqual(sb.getOption(O.some(O.some(1))), O.some(1))
  })

  it('composeLens', () => {
    type Inner = { readonly a: number }
    type S = O.Option<Inner>
    const sa = pipe(_.id<S>(), _.some)
    const ab = pipe(L.id<Inner>(), L.prop('a'))
    const sb = pipe(sa, _.composeLens(ab))
    U.deepStrictEqual(sb.getOption(O.none), O.none)
    U.deepStrictEqual(sb.getOption(O.some({ a: 1 })), O.some(1))
    U.deepStrictEqual(sb.set(2)(O.some({ a: 1 })), O.some({ a: 2 }))
    U.deepStrictEqual(sb.set(2)(O.none), O.none)
  })

  it('composePrism', () => {
    type S = O.Option<O.Option<number>>
    const sa = pipe(_.id<S>(), _.some)
    const ab = pipe(P.id<O.Option<number>>(), P.some)
    const sb = pipe(sa, _.composePrism(ab))
    U.deepStrictEqual(sb.getOption(O.none), O.none)
    U.deepStrictEqual(sb.getOption(O.some(O.none)), O.none)
    U.deepStrictEqual(sb.getOption(O.some(O.some(1))), O.some(1))
    U.deepStrictEqual(sb.set(2)(O.none), O.none)
    U.deepStrictEqual(sb.set(2)(O.some(O.none)), O.some(O.none))
    U.deepStrictEqual(sb.set(2)(O.some(O.some(1))), O.some(O.some(2)))
  })

  it('composeTraversal', () => {
    type S = {
      readonly a: O.Option<ReadonlyArray<number>>
    }
    const sa = pipe(L.id<S>(), L.prop('a'), L.some)
    const ab = T.fromTraversable(A.readonlyArray)<number>()
    const sb = pipe(sa, _.composeTraversal(ab))
    U.deepStrictEqual(sb.modifyF(Id.identity)((n) => n * 2)({ a: O.none }), { a: O.none })
    U.deepStrictEqual(sb.modifyF(Id.identity)((n) => n * 2)({ a: O.some([1, 2, 3]) }), { a: O.some([2, 4, 6]) })
  })

  it('id', () => {
    const ss = _.id<S>()
    U.deepStrictEqual(ss.getOption(O.none), O.some(O.none))
    U.deepStrictEqual(ss.getOption(O.some({ a: 'a', b: 1, c: true })), O.some(O.some({ a: 'a', b: 1, c: true })))
  })

  it('prop', () => {
    const sa = pipe(_.id<S>(), _.some, _.prop('a'))
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('a'))
  })

  it('props', () => {
    const sa = pipe(_.id<S>(), _.some, _.props('a', 'b'))
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 1 }))
  })

  it('component', () => {
    type S = O.Option<readonly [string, number]>
    const sa = pipe(_.id<S>(), _.some, _.component(1))
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some(['a', 1])), O.some(1))
  })

  it('index', () => {
    type S = ReadonlyArray<number>
    const optional = pipe(_.id<S>(), _.index(0))
    U.deepStrictEqual(optional.getOption([]), O.none)
    U.deepStrictEqual(optional.getOption([1]), O.some(1))
    U.deepStrictEqual(optional.set(2)([]), [])
    U.deepStrictEqual(optional.set(2)([1]), [2])
    // should return the same reference
    const empty: S = []
    const full: S = [1]
    assert.strictEqual(optional.set(1)(empty), empty)
    assert.strictEqual(optional.set(1)(full), full)
  })

  it('indexNonEmpty', () => {
    type S = ReadonlyNonEmptyArray<number>
    const optional = pipe(_.id<S>(), _.indexNonEmpty(1))
    U.deepStrictEqual(optional.getOption([1]), O.none)
    U.deepStrictEqual(optional.getOption([1, 2]), O.some(2))
    U.deepStrictEqual(optional.set(3)([1]), [1])
    U.deepStrictEqual(optional.set(3)([1, 2]), [1, 3])
    // should return the same reference
    const full: S = [1, 2]
    assert.strictEqual(optional.set(2)(full), full)
  })

  it('key', () => {
    const sa = pipe(_.id<ReadonlyRecord<string, number>>(), _.key('k'))
    U.deepStrictEqual(sa.getOption({ k: 1, j: 2 }), O.some(1))
  })

  it('atKey', () => {
    type S = ReadonlyRecord<string, number>
    const sa = pipe(_.id<S>(), _.atKey('a'))
    U.deepStrictEqual(sa.getOption({ a: 1 }), O.some(O.some(1)))
    U.deepStrictEqual(sa.set(O.some(2))({ a: 1, b: 2 }), { a: 2, b: 2 })
    U.deepStrictEqual(sa.set(O.some(1))({ b: 2 }), { a: 1, b: 2 })
    U.deepStrictEqual(sa.set(O.none)({ a: 1, b: 2 }), { b: 2 })
  })

  it('asTraversal', () => {
    const sa = pipe(_.id<S>(), _.some, _.prop('b'), _.asTraversal)
    U.deepStrictEqual(sa.modifyF(Id.identity)((n) => n - 1)(O.none), O.none)
    U.deepStrictEqual(
      sa.modifyF(Id.identity)((n) => n - 1)(O.some({ a: 'a', b: 2, c: true })),
      O.some({
        a: 'a',
        b: 1,
        c: true
      })
    )
  })

  it('filter', () => {
    type S = O.Option<{ readonly a: number }>
    const sa = pipe(
      _.id<S>(),
      _.some,
      _.prop('a'),
      _.filter((n) => n > 0)
    )
    U.deepStrictEqual(sa.getOption(O.some({ a: 1 })), O.some(1))
    U.deepStrictEqual(sa.getOption(O.some({ a: -1 })), O.none)
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.set(2)(O.none), O.none)
    U.deepStrictEqual(sa.set(2)(O.some({ a: 1 })), O.some({ a: 2 }))
    U.deepStrictEqual(sa.set(-1)(O.some({ a: 1 })), O.some({ a: -1 }))
    U.deepStrictEqual(sa.set(-1)(O.some({ a: -2 })), O.some({ a: -2 }))
  })

  it('findFirst', () => {
    type S = O.Option<{ readonly a: ReadonlyArray<number> }>
    const optional = pipe(
      _.id<S>(),
      _.some,
      _.prop('a'),
      _.findFirst((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption(O.none), O.none)
    U.deepStrictEqual(optional.getOption(O.some({ a: [] })), O.none)
    U.deepStrictEqual(optional.getOption(O.some({ a: [-1, -2, -3] })), O.none)
    U.deepStrictEqual(optional.getOption(O.some({ a: [-1, 2, -3] })), O.some(2))
    U.deepStrictEqual(optional.set(3)(O.none), O.none)
    U.deepStrictEqual(optional.set(3)(O.some({ a: [] })), O.some({ a: [] }))
    U.deepStrictEqual(optional.set(3)(O.some({ a: [-1, -2, -3] })), O.some({ a: [-1, -2, -3] }))
    U.deepStrictEqual(optional.set(3)(O.some({ a: [-1, 2, -3] })), O.some({ a: [-1, 3, -3] }))
    U.deepStrictEqual(optional.set(4)(O.some({ a: [-1, -2, 3] })), O.some({ a: [-1, -2, 4] }))
  })

  it('findFirstNonEmpty', () => {
    type S = O.Option<{ readonly a: ReadonlyNonEmptyArray<number> }>
    const optional = pipe(
      _.id<S>(),
      _.some,
      _.prop('a'),
      _.findFirstNonEmpty((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption(O.none), O.none)
    U.deepStrictEqual(optional.getOption(O.some({ a: [-1, -2, -3] })), O.none)
    U.deepStrictEqual(optional.getOption(O.some({ a: [-1, 2, -3] })), O.some(2))
    U.deepStrictEqual(optional.set(3)(O.none), O.none)
    U.deepStrictEqual(optional.set(3)(O.some({ a: [-1, -2, -3] })), O.some({ a: [-1, -2, -3] as const }))
    U.deepStrictEqual(optional.set(3)(O.some({ a: [-1, 2, -3] })), O.some({ a: [-1, 3, -3] as const }))
    U.deepStrictEqual(optional.set(4)(O.some({ a: [-1, -2, 3] })), O.some({ a: [-1, -2, 4] as const }))
  })

  it('traverse', () => {
    type S = O.Option<{ readonly a: ReadonlyArray<string> }>
    const sa = pipe(_.id<S>(), _.some, _.prop('a'), _.traverse(A.readonlyArray))
    const modify = pipe(
      sa,
      T.modify((s) => s.toUpperCase())
    )
    U.deepStrictEqual(modify(O.some({ a: ['a'] })), O.some({ a: ['A'] }))
  })

  it('fromNullable', () => {
    interface S {
      readonly a?: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.fromNullable)
    U.deepStrictEqual(sa.getOption({}), O.none)
    U.deepStrictEqual(sa.getOption({ a: undefined }), O.none)
    U.deepStrictEqual(sa.getOption({ a: 1 }), O.some(1))
    U.deepStrictEqual(sa.set(2)({}), {})
    U.deepStrictEqual(sa.set(2)({ a: undefined }), { a: undefined })
    U.deepStrictEqual(sa.set(2)({ a: 1 }), { a: 2 })
  })

  it('modifyF', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    const f = pipe(
      sa,
      _.modifyF(O.option)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    U.deepStrictEqual(f([]), O.some([]))
    U.deepStrictEqual(f([1, 2, 3]), O.some([2, 2, 3]))
    U.deepStrictEqual(f([-1, 2, 3]), O.none)
  })

  it('setOption', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    U.deepStrictEqual(pipe(sa, _.setOption(2))([]), O.none)
    U.deepStrictEqual(pipe(sa, _.setOption(2))([1, 3]), O.some([2, 3]))
  })
})
