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
    const ss = _.id<S>()
    const s: S = { a: 1 }
    assert.deepStrictEqual(ss.get(s), s)
    assert.deepStrictEqual(ss.set(s)(s), s)
  })

  it('fromNullable', () => {
    interface S {
      readonly a?: number
    }
    const ss = pipe(_.id<S>(), _.prop('a'), _.fromNullable)
    assert.deepStrictEqual(ss.getOption({ a: 1 }), O.some(1))
    assert.deepStrictEqual(ss.getOption({}), O.none)
  })

  it('modify', () => {
    interface S {
      readonly a: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'))
    const f = pipe(
      sa,
      _.modify((a) => a * 2)
    )
    assert.deepStrictEqual(f({ a: 1 }), { a: 2 })
  })

  it('index', () => {
    interface S {
      readonly a: ReadonlyArray<string>
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.index(0))
    assert.deepStrictEqual(sa.getOption({ a: [] }), O.none)
    assert.deepStrictEqual(sa.getOption({ a: ['a'] }), O.some('a'))
    assert.deepStrictEqual(sa.set('b')({ a: [] }), { a: [] })
    assert.deepStrictEqual(sa.set('b')({ a: ['a'] }), { a: ['b'] })
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

  it('compose', () => {
    interface S {
      readonly a: A
    }
    interface A {
      readonly b: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'))
    const ab = pipe(_.id<A>(), _.prop('b'))
    const sb = pipe(sa, _.compose(ab))
    assert.deepStrictEqual(sb.get({ a: { b: 1 } }), 1)
    assert.deepStrictEqual(sb.set(2)({ a: { b: 1 } }), { a: { b: 2 } })
  })
})
