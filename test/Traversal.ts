import * as _ from '../src/Traversal'
import * as A from 'fp-ts/lib/ReadonlyArray'
import * as Id from 'fp-ts/lib/Identity'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { monoidSum } from 'fp-ts/lib/Monoid'
import * as U from './util'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'

describe('Traversal', () => {
  describe('instances', () => {
    it('compose', () => {
      const sa = _.fromTraversable(A.readonlyArray)<ReadonlyArray<number>>()
      const ab = _.fromTraversable(A.readonlyArray)<number>()
      const sb = _.categoryTraversal.compose(ab, sa)
      U.deepStrictEqual(sb.modifyF(Id.identity)((n) => n * 2)([[1], [2], [3]]), [[2], [4], [6]])
    })
  })

  it('fromTraversable', () => {
    const sa = _.fromTraversable(A.readonlyArray)<number>()
    U.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })

  it('id', () => {
    const ss = _.id<ReadonlyArray<number>>()
    U.deepStrictEqual(ss.modifyF(Id.identity)((ns) => ns.map((n) => n * 2))([1, 2, 3]), [2, 4, 6])
  })

  it('prop', () => {
    const sa = pipe(
      _.fromTraversable(A.readonlyArray)<{
        readonly a: string
        readonly b: number
        readonly c: boolean
      }>(),
      _.prop('b')
    )
    U.deepStrictEqual(
      sa.modifyF(Id.identity)((n) => n * 2)([
        { a: 'a', b: 1, c: true },
        { a: 'aa', b: 2, c: false },
        { a: 'aaa', b: 3, c: true }
      ]),
      [
        { a: 'a', b: 2, c: true },
        { a: 'aa', b: 4, c: false },
        { a: 'aaa', b: 6, c: true }
      ]
    )
  })

  it('props', () => {
    const sa = pipe(
      _.fromTraversable(A.readonlyArray)<{
        readonly a: string
        readonly b: number
        readonly c: boolean
      }>(),
      _.props('a', 'b')
    )
    U.deepStrictEqual(
      sa.modifyF(Id.identity)((x) => ({ a: x.a, b: x.b * 2 }))([
        { a: 'a', b: 1, c: true },
        { a: 'aa', b: 2, c: false },
        { a: 'aaa', b: 3, c: true }
      ]),
      [
        { a: 'a', b: 2, c: true },
        { a: 'aa', b: 4, c: false },
        { a: 'aaa', b: 6, c: true }
      ]
    )
  })

  it('component', () => {
    const sa = pipe(_.fromTraversable(A.readonlyArray)<[string, number]>(), _.component(1))
    U.deepStrictEqual(
      sa.modifyF(Id.identity)((n) => n * 2)([
        ['a', 1],
        ['b', 2],
        ['c', 3]
      ]),
      [
        ['a', 2],
        ['b', 4],
        ['c', 6]
      ]
    )
  })

  it('index', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    U.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 2, 3])
  })

  it('key', () => {
    const sa = pipe(_.id<ReadonlyRecord<string, number>>(), _.key('k'))
    U.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)({ k: 1, j: 2 }), { k: 2, j: 2 })
  })

  it('atKey', () => {
    const sa = pipe(_.id<ReadonlyRecord<string, number>>(), _.atKey('k'))
    const f = sa.modifyF(Id.identity)((on) =>
      pipe(
        on,
        O.filter((n) => n > 0),
        O.map((n) => n * 2)
      )
    )
    U.deepStrictEqual(f({ k: 1, j: 2 }), { k: 2, j: 2 })
    U.deepStrictEqual(f({ k: 0, j: 2 }), { j: 2 })
  })

  it('traverse', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.traverse(A.readonlyArray))
    U.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })

  it('fold', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.traverse(A.readonlyArray))
    const f = pipe(sa, _.fold(monoidSum))
    U.deepStrictEqual(f([1, 2, 3]), 6)
  })

  it('getAll', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.traverse(A.readonlyArray))
    U.deepStrictEqual(pipe(sa, _.getAll([1, 2, 3])), [1, 2, 3])
  })
})
