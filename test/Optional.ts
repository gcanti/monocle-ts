import { pipe } from 'fp-ts/function'
import * as Id from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'
import * as _ from '../src/Optional'
import * as T from '../src/Traversal'
import { deepStrictEqual } from './util'

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
      deepStrictEqual(sa.getOption(O.none), O.none)
      deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('1'))
      deepStrictEqual(sa.replace('2')(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 2, c: true }))
    })
  })

  it('compose', () => {
    type S = O.Option<O.Option<number>>
    const sa = pipe(_.id<S>(), _.some)
    const ab = pipe(_.id<O.Option<number>>(), _.some)
    const sb = pipe(sa, _.compose(ab))
    deepStrictEqual(sb.getOption(O.none), O.none)
    deepStrictEqual(sb.getOption(O.some(O.none)), O.none)
    deepStrictEqual(sb.getOption(O.some(O.some(1))), O.some(1))
  })

  it('id', () => {
    const ss = _.id<S>()
    deepStrictEqual(ss.getOption(O.none), O.some(O.none))
    deepStrictEqual(ss.getOption(O.some({ a: 'a', b: 1, c: true })), O.some(O.some({ a: 'a', b: 1, c: true })))
  })

  it('prop', () => {
    const sa = pipe(_.id<S>(), _.some, _.prop('a'))
    deepStrictEqual(sa.getOption(O.none), O.none)
    deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('a'))
  })

  it('props', () => {
    const sa = pipe(_.id<S>(), _.some, _.props('a', 'b'))
    deepStrictEqual(sa.getOption(O.none), O.none)
    deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 1 }))
  })

  it('component', () => {
    type S = O.Option<readonly [string, number]>
    const sa = pipe(_.id<S>(), _.some, _.component(1))
    deepStrictEqual(sa.getOption(O.none), O.none)
    deepStrictEqual(sa.getOption(O.some(['a', 1])), O.some(1))
  })

  it('index', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    deepStrictEqual(sa.getOption([1, 2, 3]), O.some(1))
  })

  it('key', () => {
    const sa = pipe(_.id<Readonly<Record<string, number>>>(), _.key('k'))
    deepStrictEqual(sa.getOption({ k: 1, j: 2 }), O.some(1))
  })

  it('atKey', () => {
    type S = Readonly<Record<string, number>>
    const sa = pipe(_.id<S>(), _.atKey('a'))
    deepStrictEqual(sa.getOption({ a: 1 }), O.some(O.some(1)))
    deepStrictEqual(sa.replace(O.some(2))({ a: 1, b: 2 }), { a: 2, b: 2 })
    deepStrictEqual(sa.replace(O.some(1))({ b: 2 }), { a: 1, b: 2 })
    deepStrictEqual(sa.replace(O.none)({ a: 1, b: 2 }), { b: 2 })
  })

  it('asTraversal', () => {
    const sa = pipe(_.id<S>(), _.some, _.prop('b'), _.asTraversal)
    deepStrictEqual(sa.modifyF(Id.Applicative)((n) => n - 1)(O.none), O.none)
    deepStrictEqual(
      sa.modifyF(Id.Applicative)((n) => n - 1)(O.some({ a: 'a', b: 2, c: true })),
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
    deepStrictEqual(sa.getOption(O.some({ a: 1 })), O.some(1))
    deepStrictEqual(sa.getOption(O.some({ a: -1 })), O.none)
    deepStrictEqual(sa.getOption(O.none), O.none)
    deepStrictEqual(sa.replace(2)(O.none), O.none)
    deepStrictEqual(sa.replace(2)(O.some({ a: 1 })), O.some({ a: 2 }))
    deepStrictEqual(sa.replace(-1)(O.some({ a: 1 })), O.some({ a: -1 }))
    deepStrictEqual(sa.replace(-1)(O.some({ a: -2 })), O.some({ a: -2 }))
  })

  it('findFirst', () => {
    type S = O.Option<{ readonly a: ReadonlyArray<number> }>
    const sa = pipe(
      _.id<S>(),
      _.some,
      _.prop('a'),
      _.findFirst((n) => n > 0)
    )
    deepStrictEqual(sa.getOption(O.none), O.none)
    deepStrictEqual(sa.getOption(O.some({ a: [] })), O.none)
    deepStrictEqual(sa.getOption(O.some({ a: [-1, -2, -3] })), O.none)
    deepStrictEqual(sa.getOption(O.some({ a: [-1, 2, -3] })), O.some(2))
    deepStrictEqual(sa.replace(3)(O.none), O.none)
    deepStrictEqual(sa.replace(3)(O.some({ a: [] })), O.some({ a: [] }))
    deepStrictEqual(sa.replace(3)(O.some({ a: [-1, -2, -3] })), O.some({ a: [-1, -2, -3] }))
    deepStrictEqual(sa.replace(3)(O.some({ a: [-1, 2, -3] })), O.some({ a: [-1, 3, -3] }))
    deepStrictEqual(sa.replace(4)(O.some({ a: [-1, -2, 3] })), O.some({ a: [-1, -2, 4] }))
  })

  it('traverse', () => {
    type S = O.Option<{ readonly a: ReadonlyArray<string> }>
    const sa = pipe(_.id<S>(), _.some, _.prop('a'), _.traverse(A.Traversable))
    const modify = pipe(
      sa,
      T.modify((s) => s.toUpperCase())
    )
    deepStrictEqual(modify(O.some({ a: ['a'] })), O.some({ a: ['A'] }))
  })

  it('fromNullable', () => {
    interface S {
      readonly a?: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.fromNullable)
    deepStrictEqual(sa.getOption({}), O.none)
    deepStrictEqual(sa.getOption({ a: undefined }), O.none)
    deepStrictEqual(sa.getOption({ a: 1 }), O.some(1))
    deepStrictEqual(sa.replace(2)({}), {})
    deepStrictEqual(sa.replace(2)({ a: undefined }), { a: undefined })
    deepStrictEqual(sa.replace(2)({ a: 1 }), { a: 2 })
  })

  it('modifyF', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    const f = pipe(
      sa,
      _.modifyF(O.Applicative)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    deepStrictEqual(f([]), O.some([]))
    deepStrictEqual(f([1, 2, 3]), O.some([2, 2, 3]))
    deepStrictEqual(f([-1, 2, 3]), O.none)
  })
})
