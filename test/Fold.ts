import { Getter } from '../src'
import * as assert from 'assert'
import { some, none } from 'fp-ts/lib/Option'

type Point = { x: number; y: number }

const _x = new Getter<Point, number>((p: Point): number => p.x)

describe('Fold', () => {
  const eg0 = { x: 42, y: -1 }

  it('getAll', () => {
    assert.deepEqual(_x.asFold().getAll(eg0), [42])
  })

  it('find', () => {
    assert.deepEqual(_x.asFold().find(n => n >= 42)(eg0), some(42))
    assert.deepEqual(_x.asFold().find(n => n < 42)(eg0), none)
  })

  it('exist', () => {
    assert.deepEqual(_x.asFold().exist(n => n >= 42)(eg0), true)
    assert.deepEqual(_x.asFold().exist(n => n < 42)(eg0), false)
  })

  it('all', () => {
    assert.deepEqual(_x.asFold().all(n => n >= 42)(eg0), true)
    assert.deepEqual(_x.asFold().all(n => n < 42)(eg0), false)
  })
})
