import * as assert from 'assert'
import * as O from 'fp-ts/lib/Option'
import * as _ from '../src/Optional'
import { pipe } from 'fp-ts/lib/function'
import * as Id from 'fp-ts/lib/Identity'
import * as A from 'fp-ts/lib/ReadonlyArray'
import * as T from '../src/Traversal'
import * as L from '../src/Lens'
import * as P from '../src/Prism'

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
      assert.deepStrictEqual(sa.getOption(O.none), O.none)
      assert.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('1'))
      assert.deepStrictEqual(sa.set('2')(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 2, c: true }))
    })
  })

  it('compose', () => {
    type S = O.Option<O.Option<number>>
    const sa = pipe(_.id<S>(), _.some)
    const ab = pipe(_.id<O.Option<number>>(), _.some)
    const sb = _.categoryOptional.compose(ab, sa)
    assert.deepStrictEqual(sb.getOption(O.none), O.none)
    assert.deepStrictEqual(sb.getOption(O.some(O.none)), O.none)
    assert.deepStrictEqual(sb.getOption(O.some(O.some(1))), O.some(1))
  })

  it('composeLens', () => {
    type Inner = { readonly a: number }
    type S = O.Option<Inner>
    const sa = pipe(_.id<S>(), _.some)
    const ab = pipe(L.id<Inner>(), L.prop('a'))
    const sb = pipe(sa, _.composeLens(ab))
    assert.deepStrictEqual(sb.getOption(O.none), O.none)
    assert.deepStrictEqual(sb.getOption(O.some({ a: 1 })), O.some(1))
    assert.deepStrictEqual(sb.set(2)(O.some({ a: 1 })), O.some({ a: 2 }))
    assert.deepStrictEqual(sb.set(2)(O.none), O.none)
  })

  it('composePrism', () => {
    type S = O.Option<O.Option<number>>
    const sa = pipe(_.id<S>(), _.some)
    const ab = pipe(P.id<O.Option<number>>(), P.some)
    const sb = pipe(sa, _.composePrism(ab))
    assert.deepStrictEqual(sb.getOption(O.none), O.none)
    assert.deepStrictEqual(sb.getOption(O.some(O.none)), O.none)
    assert.deepStrictEqual(sb.getOption(O.some(O.some(1))), O.some(1))
    assert.deepStrictEqual(sb.set(2)(O.none), O.none)
    assert.deepStrictEqual(sb.set(2)(O.some(O.none)), O.some(O.none))
    assert.deepStrictEqual(sb.set(2)(O.some(O.some(1))), O.some(O.some(2)))
  })

  it('composeTraversal', () => {
    type S = {
      readonly a: O.Option<ReadonlyArray<number>>
    }
    const sa = pipe(L.id<S>(), L.prop('a'), L.some)
    const ab = T.fromTraversable(A.readonlyArray)<number>()
    const sb = pipe(sa, _.composeTraversal(ab))
    assert.deepStrictEqual(sb.modifyF(Id.Applicative)((n) => n * 2)({ a: O.none }), { a: O.none })
    assert.deepStrictEqual(sb.modifyF(Id.Applicative)((n) => n * 2)({ a: O.some([1, 2, 3]) }), { a: O.some([2, 4, 6]) })
  })

  it('id', () => {
    const ss = _.id<S>()
    assert.deepStrictEqual(ss.getOption(O.none), O.some(O.none))
    assert.deepStrictEqual(ss.getOption(O.some({ a: 'a', b: 1, c: true })), O.some(O.some({ a: 'a', b: 1, c: true })))
  })

  it('prop', () => {
    const sa = pipe(_.id<S>(), _.some, _.prop('a'))
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('a'))
  })

  it('props', () => {
    const sa = pipe(_.id<S>(), _.some, _.props('a', 'b'))
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 1 }))
  })

  it('component', () => {
    type S = O.Option<[string, number]>
    const sa = pipe(_.id<S>(), _.some, _.component(1))
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some(['a', 1])), O.some(1))
  })

  it('index', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    assert.deepStrictEqual(sa.getOption([1, 2, 3]), O.some(1))
  })

  it('key', () => {
    const sa = pipe(_.id<Readonly<Record<string, number>>>(), _.key('k'))
    assert.deepStrictEqual(sa.getOption({ k: 1, j: 2 }), O.some(1))
  })

  it('atKey', () => {
    type S = Readonly<Record<string, number>>
    const sa = pipe(_.id<S>(), _.atKey('a'))
    assert.deepStrictEqual(sa.getOption({ a: 1 }), O.some(O.some(1)))
    assert.deepStrictEqual(sa.set(O.some(2))({ a: 1, b: 2 }), { a: 2, b: 2 })
    assert.deepStrictEqual(sa.set(O.some(1))({ b: 2 }), { a: 1, b: 2 })
    assert.deepStrictEqual(sa.set(O.none)({ a: 1, b: 2 }), { b: 2 })
  })

  it('asTraversal', () => {
    const sa = pipe(_.id<S>(), _.some, _.prop('b'), _.asTraversal)
    assert.deepStrictEqual(sa.modifyF(Id.identity)((n) => n - 1)(O.none), O.none)
    assert.deepStrictEqual(
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
    assert.deepStrictEqual(sa.getOption(O.some({ a: 1 })), O.some(1))
    assert.deepStrictEqual(sa.getOption(O.some({ a: -1 })), O.none)
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.set(2)(O.none), O.none)
    assert.deepStrictEqual(sa.set(2)(O.some({ a: 1 })), O.some({ a: 2 }))
    assert.deepStrictEqual(sa.set(-1)(O.some({ a: 1 })), O.some({ a: -1 }))
    assert.deepStrictEqual(sa.set(-1)(O.some({ a: -2 })), O.some({ a: -2 }))
  })

  it('findFirst', () => {
    type S = O.Option<{ readonly a: ReadonlyArray<number> }>
    const sa = pipe(
      _.id<S>(),
      _.some,
      _.prop('a'),
      _.findFirst((n) => n > 0)
    )
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: [] })), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: [-1, -2, -3] })), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: [-1, 2, -3] })), O.some(2))
    assert.deepStrictEqual(sa.set(3)(O.none), O.none)
    assert.deepStrictEqual(sa.set(3)(O.some({ a: [] })), O.some({ a: [] }))
    assert.deepStrictEqual(sa.set(3)(O.some({ a: [-1, -2, -3] })), O.some({ a: [-1, -2, -3] }))
    assert.deepStrictEqual(sa.set(3)(O.some({ a: [-1, 2, -3] })), O.some({ a: [-1, 3, -3] }))
    assert.deepStrictEqual(sa.set(4)(O.some({ a: [-1, -2, 3] })), O.some({ a: [-1, -2, 4] }))
  })

  it('traverse', () => {
    type S = O.Option<{ readonly a: ReadonlyArray<string> }>
    const sa = pipe(_.id<S>(), _.some, _.prop('a'), _.traverse(A.readonlyArray))
    const modify = pipe(
      sa,
      T.modify((s) => s.toUpperCase())
    )
    assert.deepStrictEqual(modify(O.some({ a: ['a'] })), O.some({ a: ['A'] }))
  })

  it('fromNullable', () => {
    interface S {
      readonly a?: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.fromNullable)
    assert.deepStrictEqual(sa.getOption({}), O.none)
    assert.deepStrictEqual(sa.getOption({ a: undefined }), O.none)
    assert.deepStrictEqual(sa.getOption({ a: 1 }), O.some(1))
    assert.deepStrictEqual(sa.set(2)({}), {})
    assert.deepStrictEqual(sa.set(2)({ a: undefined }), { a: undefined })
    assert.deepStrictEqual(sa.set(2)({ a: 1 }), { a: 2 })
  })

  it('modifyF', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    const f = pipe(
      sa,
      _.modifyF(O.Applicative)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    assert.deepStrictEqual(f([]), O.some([]))
    assert.deepStrictEqual(f([1, 2, 3]), O.some([2, 2, 3]))
    assert.deepStrictEqual(f([-1, 2, 3]), O.none)
  })

  it('setOption', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    assert.deepStrictEqual(pipe(sa, _.setOption(2))([]), O.none)
    assert.deepStrictEqual(pipe(sa, _.setOption(2))([1, 3]), O.some([2, 3]))
  })
})
