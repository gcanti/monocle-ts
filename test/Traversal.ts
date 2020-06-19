import * as assert from 'assert'
import * as _ from '../src/Traversal'
import * as A from 'fp-ts/lib/ReadonlyArray'
import * as Id from 'fp-ts/lib/Identity'
import { pipe } from 'fp-ts/lib/function'

describe('Traversal', () => {
  describe('instances', () => {
    it('compose', () => {
      const sa = _.fromTraversable(A.readonlyArray)<ReadonlyArray<number>>()
      const ab = _.fromTraversable(A.readonlyArray)<number>()
      const sb = _.categoryTraversal.compose(ab, sa)
      assert.deepStrictEqual(sb.modifyF(Id.identity)((n) => n * 2)([[1], [2], [3]]), [[2], [4], [6]])
    })
  })

  it('fromTraversable', () => {
    const sa = _.fromTraversable(A.readonlyArray)<number>()
    assert.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })

  it('id', () => {
    const ss = _.id<ReadonlyArray<number>>()
    assert.deepStrictEqual(ss.modifyF(Id.identity)((ns) => ns.map((n) => n * 2))([1, 2, 3]), [2, 4, 6])
  })

  it('prop', () => {
    const sa = pipe(_.fromTraversable(A.readonlyArray)<{ a: string; b: number; c: boolean }>(), _.prop('b'))
    assert.deepStrictEqual(
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
    const sa = pipe(_.fromTraversable(A.readonlyArray)<{ a: string; b: number; c: boolean }>(), _.props('a', 'b'))
    assert.deepStrictEqual(
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

  it('index', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.index(0))
    assert.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 2, 3])
  })

  it('key', () => {
    const sa = pipe(_.id<Readonly<Record<string, number>>>(), _.key('k'))
    assert.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)({ k: 1, j: 2 }), { k: 2, j: 2 })
  })

  it('traverse', () => {
    const sa = pipe(_.id<ReadonlyArray<number>>(), _.traverse(A.readonlyArray))
    assert.deepStrictEqual(sa.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })
})
