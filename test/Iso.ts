import { Iso } from '../src'
import * as assert from 'assert'

const mTokm = new Iso<number, number>(m => m / 1000, km => km * 1000)
const kmToMile = new Iso<number, number>(km => km * 0.621371, mile => mile / 0.621371)

describe('Iso', () => {
  it('get', () => {
    assert.strictEqual(mTokm.get(100), 0.1)
  })

  it('reverseGet', () => {
    assert.strictEqual(mTokm.reverseGet(1.2), 1200)
  })

  it('modify', () => {
    const double = (x: number) => x * 2
    assert.strictEqual(mTokm.modify(double, 1000), 2000)
  })

  it('compose', () => {
    assert.strictEqual(mTokm.compose(kmToMile).get(1500).toFixed(2), '0.93')
  })
})
