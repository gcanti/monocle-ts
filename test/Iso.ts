import { pipe } from 'fp-ts/lib/pipeable'
import * as _ from '../src/Iso'
import * as Id from 'fp-ts/lib/Identity'
import * as O from 'fp-ts/lib/Option'
import * as U from './util'

const numberFromString: _.Iso<number, string> = {
  get: String,
  reverseGet: parseFloat
}

const double: _.Iso<number, number> = {
  get: (n) => n * 2,
  reverseGet: (n) => n / 2
}

describe('Iso', () => {
  describe('pipeables', () => {
    it('imap', () => {
      const sb = pipe(
        numberFromString,
        _.imap(
          (s) => '+' + s,
          (s) => s.substring(1)
        )
      )
      U.deepStrictEqual(sb.get(1), '+1')
      U.deepStrictEqual(sb.reverseGet('+1'), 1)
    })
  })

  describe('instances', () => {
    it('compose', () => {
      const sb = _.categoryIso.compose(numberFromString, double)
      U.deepStrictEqual(sb.get(1), '2')
      U.deepStrictEqual(sb.reverseGet('2'), 1)
    })
  })

  it('id', () => {
    const ss = _.id<number>()
    U.deepStrictEqual(ss.get(1), 1)
    U.deepStrictEqual(ss.reverseGet(1), 1)
  })

  it('reverse', () => {
    const as = _.reverse(numberFromString)
    U.deepStrictEqual(as.get('1'), 1)
    U.deepStrictEqual(as.reverseGet(1), '1')
  })

  it('compose', () => {
    const sb = pipe(double, _.compose(numberFromString))
    U.deepStrictEqual(sb.get(1), '2')
    U.deepStrictEqual(sb.reverseGet('2'), 1)
  })

  it('asTraversal', () => {
    const sa = pipe(double, _.asTraversal)
    U.deepStrictEqual(sa.modifyF(Id.identity)((n) => n - 1)(3), 2.5)
  })

  it('modifyF', () => {
    const f = pipe(
      double,
      _.modifyF(O.option)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    U.deepStrictEqual(f(1), O.some(2))
    U.deepStrictEqual(f(-1), O.none)
  })
})
