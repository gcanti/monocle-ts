import { Setter } from '../../src'
import * as assert from 'assert'

type Point = { x: number; y: number }

const _x = new Setter<Point, number>((f) => (s) => ({
  x: f(s.x),
  y: s.y
}))

describe('Setter', () => {
  const double = (n: number) => n * 2
  const eg0 = { x: 42, y: -1 }

  it('modify', () => {
    const eg1 = _x.modify(double)(eg0)
    assert.strictEqual(eg1.x, double(eg0.x))
    assert.strictEqual(eg1.y, eg0.y)
  })

  it('set', () => {
    assert.strictEqual(_x.set(0)(eg0).x, 0)
  })
})
