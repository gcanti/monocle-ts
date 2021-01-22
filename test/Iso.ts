import * as assert from 'assert'
import { increment, pipe } from 'fp-ts/function'
import * as Id from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as _ from '../src/Iso'
import { deepStrictEqual } from './util'

const numberFromString: _.Iso<number, string> = {
  get: String,
  reverseGet: parseFloat
}

const double: _.Iso<number, number> = {
  get: (n) => n * 2,
  reverseGet: (n) => n / 2
}

describe('Iso', () => {
  // -------------------------------------------------------------------------------------
  // type class members
  // -------------------------------------------------------------------------------------

  it('imap', () => {
    const sb = pipe(
      numberFromString,
      _.imap(
        (s) => '+' + s,
        (s) => s.substring(1)
      )
    )
    deepStrictEqual(sb.get(1), '+1')
    deepStrictEqual(sb.reverseGet('+1'), 1)
  })

  it('modify', () => {
    assert.strictEqual(pipe(double, _.modify(increment))(1000), 1000.5)
  })

  it('id', () => {
    const ss = _.id<number>()
    deepStrictEqual(ss.get(1), 1)
    deepStrictEqual(ss.reverseGet(1), 1)
  })

  it('reverse', () => {
    const as = _.reverse(numberFromString)
    deepStrictEqual(as.get('1'), 1)
    deepStrictEqual(as.reverseGet(1), '1')
  })

  it('compose', () => {
    const sb = pipe(double, _.compose(numberFromString))
    deepStrictEqual(sb.get(1), '2')
    deepStrictEqual(sb.reverseGet('2'), 1)
  })

  it('asPrism', () => {
    const sa = pipe(double, _.asPrism)
    deepStrictEqual(sa.getOption(1), O.some(2))
    deepStrictEqual(sa.reverseGet(2), 1)
  })

  it('asTraversal', () => {
    const sa = pipe(double, _.asTraversal)
    deepStrictEqual(sa.modifyF(Id.Applicative)((n) => n - 1)(3), 2.5)
  })

  it('modifyF', () => {
    const f = pipe(
      double,
      _.modifyF(O.Functor)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    deepStrictEqual(f(1), O.some(2))
    deepStrictEqual(f(-1), O.none)
  })
})
