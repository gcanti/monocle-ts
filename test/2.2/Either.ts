import { _right, _left } from '../../src/Either'
import { right, left } from 'fp-ts/lib/Either'
import { some, none } from 'fp-ts/lib/Option'
import * as U from '../util'

describe('Either', () => {
  it('_right', () => {
    const prism = _right<string, number>()
    U.deepStrictEqual(prism.getOption(right(1)), some(1))
    U.deepStrictEqual(prism.getOption(left('a')), none)
  })

  it('_left', () => {
    const prism = _left<string, number>()
    U.deepStrictEqual(prism.getOption(right(1)), none)
    U.deepStrictEqual(prism.getOption(left('a')), some('a'))
  })
})
