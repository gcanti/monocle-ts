import * as assert from 'assert'
import { pipe } from 'fp-ts/lib/pipeable'
import * as _ from '../src/Iso'
import * as Id from 'fp-ts/lib/Identity'
import * as O from 'fp-ts/lib/Option'

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
      assert.deepStrictEqual(sb.get(1), '+1')
      assert.deepStrictEqual(sb.reverseGet('+1'), 1)
    })
  })

  describe('instances', () => {
    it('compose', () => {
      const sb = _.categoryIso.compose(numberFromString, double)
      assert.deepStrictEqual(sb.get(1), '2')
      assert.deepStrictEqual(sb.reverseGet('2'), 1)
    })
  })

  it('id', () => {
    const ss = _.id<number>()
    assert.deepStrictEqual(ss.get(1), 1)
    assert.deepStrictEqual(ss.reverseGet(1), 1)
  })

  it('reverse', () => {
    const as = _.reverse(numberFromString)
    assert.deepStrictEqual(as.get('1'), 1)
    assert.deepStrictEqual(as.reverseGet(1), '1')
  })

  it('compose', () => {
    const sb = pipe(double, _.compose(numberFromString))
    assert.deepStrictEqual(sb.get(1), '2')
    assert.deepStrictEqual(sb.reverseGet('2'), 1)
  })

  it('asTraversal', () => {
    const sa = pipe(double, _.asTraversal)
    assert.deepStrictEqual(sa.modifyF(Id.identity)((n) => n - 1)(3), 2.5)
  })

  it('modifyF', () => {
    const f = pipe(
      double,
      _.modifyF(O.option)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    assert.deepStrictEqual(f(1), O.some(2))
    assert.deepStrictEqual(f(-1), O.none)
  })
})
