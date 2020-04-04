import { Getter, fromFoldable } from '../src'
import * as assert from 'assert'
import { some, none } from 'fp-ts/lib/Option'
import { array } from 'fp-ts/lib/Array'

type Point = { x: number; y: number }

const _x = new Getter<Point, number>((p: Point): number => p.x)

describe('Fold', () => {
  const eg0 = { x: 42, y: -1 }

  it('getAll', () => {
    assert.deepStrictEqual(_x.asFold().getAll(eg0), [42])
  })

  it('find', () => {
    assert.deepStrictEqual(_x.asFold().find((n) => n >= 42)(eg0), some(42))
    assert.deepStrictEqual(_x.asFold().find((n) => n < 42)(eg0), none)
  })

  it('exist', () => {
    assert.deepStrictEqual(_x.asFold().exist((n) => n >= 42)(eg0), true)
    assert.deepStrictEqual(_x.asFold().exist((n) => n < 42)(eg0), false)
  })

  it('all', () => {
    assert.deepStrictEqual(_x.asFold().all((n) => n >= 42)(eg0), true)
    assert.deepStrictEqual(_x.asFold().all((n) => n < 42)(eg0), false)
  })

  it('fromFoldable', () => {
    const fold = fromFoldable(array)<number>()
    assert.deepStrictEqual(fold.all((n) => n >= 2)([1, 2, 3]), false)
    assert.deepStrictEqual(fold.all((n) => n >= 1)([1, 2, 3]), true)
  })

  it('headOption', () => {
    const fold = fromFoldable(array)<number>()
    assert.deepStrictEqual(fold.headOption([]), none)
    assert.deepStrictEqual(fold.headOption([1, 2, 3]), some(1))
  })
})
