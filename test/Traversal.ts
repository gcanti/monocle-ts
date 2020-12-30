import * as assert from 'assert'
import * as _ from '../src/Traversal'
import * as A from 'fp-ts/lib/ReadonlyArray'
import * as Id from 'fp-ts/lib/Identity'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { monoidSum } from 'fp-ts/lib/Monoid'

describe('Traversal', () => {
  it('compose', () => {
    const sa = _.fromTraversable(A.Traversable)<ReadonlyArray<number>>()
    const ab = _.fromTraversable(A.Traversable)<number>()
    const sb = pipe(sa, _.compose(ab))
    assert.deepStrictEqual(sb.modifyF(Id.Applicative)((n) => n * 2)([[1], [2], [3]]), [[2], [4], [6]])
  })

  it('fromTraversable', () => {
    const sa = _.fromTraversable(A.Traversable)<number>()
    assert.deepStrictEqual(sa.modifyF(Id.Applicative)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })

  it('id', () => {
    const ss = _.id<ReadonlyArray<number>>()
    assert.deepStrictEqual(ss.modifyF(Id.Applicative)((ns) => ns.map((n) => n * 2))([1, 2, 3]), [2, 4, 6])
  })

  it('prop', () => {
    const sa = pipe(_.fromTraversable(A.Traversable)<{ a: string; b: number; c: boolean }>(), _.prop('b'))
    assert.deepStrictEqual(
      sa.modifyF(Id.Applicative)((n) => n * 2)([
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
    const sa = pipe(_.fromTraversable(A.Traversable)<{ a: string; b: number; c: boolean }>(), _.props('a', 'b'))
    assert.deepStrictEqual(
      sa.modifyF(Id.Applicative)((x) => ({ a: x.a, b: x.b * 2 }))([
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
    const sa = pipe(_.fromTraversable(A.Traversable)<[string, number]>(), _.component(1))
    assert.deepStrictEqual(
      sa.modifyF(Id.Applicative)((n) => n * 2)([
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
    assert.deepStrictEqual(sa.modifyF(Id.Applicative)((n) => n * 2)([1, 2, 3]), [2, 2, 3])
  })

  it('key', () => {
    const sa = pipe(_.id<Readonly<Record<string, number>>>(), _.key('k'))
    assert.deepStrictEqual(sa.modifyF(Id.Applicative)((n) => n * 2)({ k: 1, j: 2 }), { k: 2, j: 2 })
  })

  it('atKey', () => {
    const sa = pipe(_.id<Readonly<Record<string, number>>>(), _.atKey('k'))
    const f = sa.modifyF(Id.Applicative)((on) =>
      pipe(
        on,
        O.filter((n) => n > 0),
        O.map((n) => n * 2)
      )
    )
    assert.deepStrictEqual(f({ k: 1, j: 2 }), { k: 2, j: 2 })
    assert.deepStrictEqual(f({ k: 0, j: 2 }), { j: 2 })
  })

  it('traverse', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.traverse(A.Traversable))
    assert.deepStrictEqual(sa.modifyF(Id.Applicative)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })

  it('fold', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.traverse(A.Traversable))
    const f = pipe(sa, _.fold(monoidSum))
    assert.deepStrictEqual(f([1, 2, 3]), 6)
  })

  it('getAll', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.traverse(A.Traversable))
    assert.deepStrictEqual(pipe(sa, _.getAll([1, 2, 3])), [1, 2, 3])
  })
})
