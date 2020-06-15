import * as assert from 'assert'
import * as O from 'fp-ts/lib/Option'
import * as _ from '../src/Optional'
import { pipe } from 'fp-ts/lib/function'
import * as Id from 'fp-ts/lib/Identity'

type A = O.Option<{
  a: string
  b: number
  c: boolean
}>

describe('Optional', () => {
  describe('pipeables', () => {
    it('imap', () => {
      const sa = pipe(
        pipe(_.id<A>(), _.some, _.prop('b')),
        _.imap(
          (n) => String(n),
          (s) => parseFloat(s)
        )
      )
      assert.deepStrictEqual(sa.getOption(O.none), O.none)
      assert.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('1'))
      assert.deepStrictEqual(sa.set('2')(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 2, c: true }))
    })
  })

  describe('instances', () => {
    it('compose', () => {
      type S = O.Option<O.Option<number>>
      const sa = pipe(_.id<S>(), _.some)
      const ab = pipe(_.id<O.Option<number>>(), _.some)
      const sb = _.categoryOptional.compose(ab, sa)
      assert.deepStrictEqual(sb.getOption(O.none), O.none)
      assert.deepStrictEqual(sb.getOption(O.some(O.none)), O.none)
      assert.deepStrictEqual(sb.getOption(O.some(O.some(1))), O.some(1))
    })
  })

  it('id', () => {
    const ss = _.id<A>()
    assert.deepStrictEqual(ss.getOption(O.none), O.some(O.none))
    assert.deepStrictEqual(ss.getOption(O.some({ a: 'a', b: 1, c: true })), O.some(O.some({ a: 'a', b: 1, c: true })))
  })

  it('prop', () => {
    const sa = pipe(_.id<A>(), _.some, _.prop('a'))
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some('a'))
  })

  it('props', () => {
    const sa = pipe(_.id<A>(), _.some, _.props('a', 'b'))
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 1 }))
  })

  it('asTraversal', () => {
    const sa = pipe(_.id<A>(), _.some, _.prop('b'), _.asTraversal)
    assert.deepStrictEqual(sa.modifyF(Id.identity)((n) => n - 1)(O.none), O.none)
    assert.deepStrictEqual(
      sa.modifyF(Id.identity)((n) => n - 1)(O.some({ a: 'a', b: 2, c: true })),
      O.some({
        a: 'a',
        b: 1,
        c: true
      })
    )
  })
})
