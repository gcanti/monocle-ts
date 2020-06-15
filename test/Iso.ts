import * as assert from 'assert'
import * as _ from '../src/Iso'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as T from '../src/Traversal'
import * as A from 'fp-ts/lib/ReadonlyArray'

interface S {
  readonly b: boolean
  readonly n: number
}

type A = readonly [boolean, number]

const sa: _.Iso<S, A> = {
  get: ({ b, n }) => [b, n],
  reverseGet: ([b, n]) => ({ b, n })
}

const ab: _.Iso<A, string> = {
  get: (x) => JSON.stringify(x),
  reverseGet: (y) => JSON.parse(y)
}

describe('Iso', () => {
  describe('pipeables', () => {
    it('imap', () => {
      const sa: _.Iso<S, A> = pipe(
        _.id<S>(),
        _.imap(
          ({ b, n }) => [b, n] as const,
          ([b, n]) => ({ b, n })
        )
      )
      assert.deepStrictEqual(sa.get({ b: true, n: 0 }), [true, 0])
      assert.deepStrictEqual(sa.reverseGet([true, 0]), { b: true, n: 0 })
    })
  })

  describe('instances', () => {
    it('compose', () => {
      const sb = _.categoryIso.compose(ab, sa)
      assert.deepStrictEqual(sb.get({ b: true, n: 0 }), '[true,0]')
      assert.deepStrictEqual(sb.reverseGet('[true,0]'), { b: true, n: 0 })
    })
  })

  it('id', () => {
    const ss = _.id<S>()
    const s: S = { b: true, n: 0 }
    assert.deepStrictEqual(ss.get(s), s)
    assert.deepStrictEqual(ss.reverseGet(s), s)
  })

  it('reverse', () => {
    const as = _.reverse(sa)
    assert.deepStrictEqual(as.get([true, 0]), { b: true, n: 0 })
    assert.deepStrictEqual(as.reverseGet({ b: true, n: 0 }), [true, 0])
  })

  it('composeIso', () => {
    const sb = pipe(sa, _.composeIso(ab))
    assert.deepStrictEqual(sb.get({ b: true, n: 0 }), '[true,0]')
    assert.deepStrictEqual(sb.reverseGet('[true,0]'), { b: true, n: 0 })
  })

  it('composeTraversal', () => {
    const ss = pipe(_.id<ReadonlyArray<number>>(), _.composeTraversal(T.fromTraversable(A.readonlyArray)<number>()))
    assert.deepStrictEqual(ss.modifyF(O.option)((n) => (n > 0 ? O.some(n * 2) : O.none))([1, 2, 3]), O.some([2, 4, 6]))
    assert.deepStrictEqual(ss.modifyF(O.option)((n) => (n > 0 ? O.some(n * 2) : O.none))([-1, 2, 3]), O.none)
  })
})
