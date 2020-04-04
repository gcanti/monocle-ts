import { Iso } from '../src'
import * as assert from 'assert'

const mTokm = new Iso<number, number>(
  (m) => m / 1000,
  (km) => km * 1000
)
const kmToMile = new Iso<number, number>(
  (km) => km * 0.621371,
  (mile) => mile / 0.621371
)

describe('Iso', () => {
  it('get', () => {
    assert.strictEqual(mTokm.get(100), 0.1)
    assert.strictEqual(mTokm.unwrap(100), 0.1)
    assert.strictEqual(mTokm.to(100), 0.1)
  })

  it('reverseGet', () => {
    assert.strictEqual(mTokm.reverseGet(1.2), 1200)
    assert.strictEqual(mTokm.wrap(1.2), 1200)
    assert.strictEqual(mTokm.from(1.2), 1200)
  })

  it('modify', () => {
    const double = (x: number) => x * 2
    assert.strictEqual(mTokm.modify(double)(1000), 2000)
  })

  it('reverse', () => {
    const double = (x: number) => x * 2
    assert.strictEqual(mTokm.reverse().modify(double)(2000), 4000)
  })

  it('compose', () => {
    const composition1 = mTokm.compose(kmToMile)
    const composition2 = mTokm.composeIso(kmToMile)
    assert.strictEqual(composition1.get(1500).toFixed(2), '0.93')
    assert.strictEqual(composition1.reverseGet(1).toFixed(2), '1609.34')

    assert.strictEqual(composition2.get(1500), composition1.get(1500))
    assert.strictEqual(composition2.reverseGet(1), composition1.reverseGet(1))
  })
})
