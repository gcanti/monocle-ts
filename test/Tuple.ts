import * as assert from 'assert'
import { _1, _2 } from '../src/Tuple'
import * as U from './util'

describe('Tuple', () => {
  const mock: [number, string] = [1, 'a']

  it('gets', () => {
    assert.strictEqual(_1().get(mock), 1)
    assert.strictEqual(_2().get(mock), 'a')
  })

  it('sets', () => {
    U.deepStrictEqual(_1().set(2)(mock), [2, 'a'])
    U.deepStrictEqual(_2().set('b')(mock), [1, 'b'])
  })
})
