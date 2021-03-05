import { Getter, fromFoldable } from '../../src'
import { some, none } from 'fp-ts/lib/Option'
import { array } from 'fp-ts/lib/Array'
import * as U from '../util'

type Point = {
  readonly x: number
  readonly y: number
}

const _x = new Getter<Point, number>((p: Point): number => p.x)

describe('Fold', () => {
  const eg0 = { x: 42, y: -1 }

  it('getAll', () => {
    U.deepStrictEqual(_x.asFold().getAll(eg0), [42])
  })

  it('find', () => {
    U.deepStrictEqual(_x.asFold().find((n) => n >= 42)(eg0), some(42))
    U.deepStrictEqual(_x.asFold().find((n) => n < 42)(eg0), none)
  })

  it('exist', () => {
    U.deepStrictEqual(_x.asFold().exist((n) => n >= 42)(eg0), true)
    U.deepStrictEqual(_x.asFold().exist((n) => n < 42)(eg0), false)
  })

  it('all', () => {
    U.deepStrictEqual(_x.asFold().all((n) => n >= 42)(eg0), true)
    U.deepStrictEqual(_x.asFold().all((n) => n < 42)(eg0), false)
  })

  it('fromFoldable', () => {
    const fold = fromFoldable(array)<number>()
    U.deepStrictEqual(fold.all((n) => n >= 2)([1, 2, 3]), false)
    U.deepStrictEqual(fold.all((n) => n >= 1)([1, 2, 3]), true)
  })

  it('headOption', () => {
    const fold = fromFoldable(array)<number>()
    U.deepStrictEqual(fold.headOption([]), none)
    U.deepStrictEqual(fold.headOption([1, 2, 3]), some(1))
  })
})
