import * as assert from 'assert'
import * as _ from '../src/Lens'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/ReadonlyArray'
import * as T from '../src/Traversal'

describe('Lens', () => {
  describe('pipeables', () => {
    it('imap', () => {
      interface S {
        readonly a: number
      }
      const sa: _.Lens<S, number> = pipe(
        _.id<S>(),
        _.imap(
          (s) => s.a,
          (a) => ({ a })
        )
      )
      assert.deepStrictEqual(sa.get({ a: 1 }), 1)
      assert.deepStrictEqual(sa.set(2)({ a: 1 }), { a: 2 })
    })
  })

  describe('instances', () => {
    it('compose', () => {
      interface S {
        readonly a: A
      }
      interface A {
        readonly b: number
      }
      const sa = pipe(_.id<S>(), _.prop('a'))
      const ab = pipe(_.id<A>(), _.prop('b'))
      const sb = _.categoryLens.compose(ab, sa)
      assert.deepStrictEqual(sb.get({ a: { b: 1 } }), 1)
      assert.deepStrictEqual(sb.set(2)({ a: { b: 1 } }), { a: { b: 2 } })
    })
  })

  it('id', () => {
    interface S {
      readonly a: number
    }
    const s: S = { a: 1 }
    const lens = _.id<S>()
    assert.deepStrictEqual(lens.get(s), s)
    assert.deepStrictEqual(lens.set(s)(s), s)
  })

  it('modify', () => {
    interface S {
      readonly a: number
    }
    const lens = pipe(_.id<S>(), _.prop('a'))
    const f = pipe(
      lens,
      _.modify((a) => a * 2)
    )
    assert.deepStrictEqual(f({ a: 1 }), { a: 2 })
  })

  it('index', () => {
    interface S {
      readonly a: ReadonlyArray<string>
    }
    const optional = pipe(_.id<S>(), _.prop('a'), _.index(0))
    assert.deepStrictEqual(optional.getOption({ a: [] }), O.none)
    assert.deepStrictEqual(optional.getOption({ a: ['a'] }), O.some('a'))
  })

  it('traverse', () => {
    interface S {
      readonly a: ReadonlyArray<string>
    }
    const traversal = pipe(_.id<S>(), _.prop('a'), _.traverse(A.readonlyArray))
    const modify = pipe(
      traversal,
      T.modify((s) => s.toUpperCase())
    )
    assert.deepStrictEqual(modify({ a: ['a'] }), { a: ['A'] })
  })

  it('composeLens', () => {
    interface S {
      readonly a: A
    }
    interface A {
      readonly b: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'))
    const ab = pipe(_.id<A>(), _.prop('b'))
    const sb = pipe(sa, _.composeLens(ab))
    assert.deepStrictEqual(sb.get({ a: { b: 1 } }), 1)
    assert.deepStrictEqual(sb.set(2)({ a: { b: 1 } }), { a: { b: 2 } })
  })
})
