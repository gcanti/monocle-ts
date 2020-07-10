import * as assert from 'assert'
import * as _ from '../src/Lens'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/ReadonlyArray'
import * as T from '../src/Traversal'
import { Optional } from '../src/Optional'

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
    const sa = pipe(_.id<S>(), _.prop('a'), _.fromNullable)
    const s: S = { a: 1 }
    assert.deepStrictEqual(sa.getOption(s), O.some(1))
    assert.deepStrictEqual(sa.getOption({}), O.none)
    // should return the same reference
    assert.strictEqual(sa.set(1)(s), s)
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

  it('prop', () => {
    interface S {
      readonly a: {
        readonly b: number
      }
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.prop('b'))
    const s: S = { a: { b: 1 } }
    assert.strictEqual(sa.get(s), 1)
    assert.deepStrictEqual(sa.set(2)(s), { a: { b: 2 } })
    // should return the same reference
    assert.strictEqual(sa.set(1)(s), s)
  })

  it('props', () => {
    interface S {
      readonly a: {
        readonly b: string
        readonly c: number
        readonly d: boolean
      }
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.props('b', 'c'))
    const s: S = { a: { b: 'b', c: 1, d: true } }
    assert.deepStrictEqual(sa.get(s), { b: 'b', c: 1 })
    assert.deepStrictEqual(sa.set({ b: 'b', c: 2 })(s), { a: { b: 'b', c: 2, d: true } })
    // should return the same reference
    assert.strictEqual(sa.set({ b: 'b', c: 1 })(s), s)
  })

  it('component', () => {
    interface S {
      readonly a: [string, number]
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.component(1))
    const s: S = { a: ['a', 1] }
    assert.strictEqual(sa.get(s), 1)
    assert.deepStrictEqual(sa.set(2)(s), { a: ['a', 2] })
    // should return the same reference
    assert.strictEqual(sa.set(1)(s), s)
  })

  it('index', () => {
    interface S {
      readonly a: ReadonlyArray<number>
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.index(0))
    const empty: S = { a: [] }
    const full: S = { a: [1, 2] }
    assert.deepStrictEqual(sa.getOption(empty), O.none)
    assert.deepStrictEqual(sa.getOption(full), O.some(1))
    assert.deepStrictEqual(sa.set(2)(full), { a: [2, 2] })
    // should return the same reference
    assert.strictEqual(sa.set(2)(empty), empty)
    assert.strictEqual(sa.set(1)(full), full)
  })

  it('key', () => {
    interface S {
      readonly a: Readonly<Record<string, number>>
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.key('k'))
    const empty: S = { a: {} }
    const full: S = { a: { k: 1, j: 2 } }
    assert.deepStrictEqual(sa.getOption(empty), O.none)
    assert.deepStrictEqual(sa.getOption(full), O.some(1))
    assert.deepStrictEqual(sa.set(2)(full), { a: { k: 2, j: 2 } })
    // should return the same reference
    assert.strictEqual(sa.set(2)(empty), empty)
    assert.strictEqual(sa.set(1)(full), full)
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

  it('composeOptional', () => {
    interface S {
      readonly a: string
    }
    const sa = pipe(_.id<S>(), _.prop('a'))
    const ab: Optional<string, string> = {
      getOption: (s) => (s.length > 0 ? O.some(s[0]) : O.none),
      set: (a) => (s) => (s.length > 0 ? a + s.substring(1) : s)
    }
    const sb = pipe(sa, _.composeOptional(ab))
    assert.deepStrictEqual(sb.getOption({ a: '' }), O.none)
    assert.deepStrictEqual(sb.getOption({ a: 'ab' }), O.some('a'))
    assert.deepStrictEqual(sb.set('c')({ a: '' }), { a: '' })
    assert.deepStrictEqual(sb.set('c')({ a: 'ab' }), { a: 'cb' })
  })

  it('atKey', () => {
    type S = Readonly<Record<string, number>>
    const sa = pipe(_.id<S>(), _.atKey('a'))
    assert.deepStrictEqual(sa.get({ a: 1 }), O.some(1))
    assert.deepStrictEqual(sa.set(O.some(2))({ a: 1, b: 2 }), { a: 2, b: 2 })
    assert.deepStrictEqual(sa.set(O.some(1))({ b: 2 }), { a: 1, b: 2 })
    assert.deepStrictEqual(sa.set(O.none)({ a: 1, b: 2 }), { b: 2 })
  })

  it('filter', () => {
    interface S {
      readonly a: number
    }
    const sa = pipe(
      _.id<S>(),
      _.prop('a'),
      _.filter((n) => n > 0)
    )
    assert.deepStrictEqual(sa.getOption({ a: 1 }), O.some(1))
    assert.deepStrictEqual(sa.getOption({ a: -1 }), O.none)
    assert.deepStrictEqual(sa.set(2)({ a: 1 }), { a: 2 })
    assert.deepStrictEqual(sa.set(2)({ a: -1 }), { a: -1 })
  })

  it('findFirst', () => {
    type S = ReadonlyArray<number>
    const sa = pipe(
      _.id<S>(),
      _.findFirst((n) => n > 0)
    )
    assert.deepStrictEqual(sa.getOption([]), O.none)
    assert.deepStrictEqual(sa.getOption([-1, -2, -3]), O.none)
    assert.deepStrictEqual(sa.getOption([-1, 2, -3]), O.some(2))
    assert.deepStrictEqual(sa.set(3)([]), [])
    assert.deepStrictEqual(sa.set(3)([-1, -2, -3]), [-1, -2, -3])
    assert.deepStrictEqual(sa.set(3)([-1, 2, -3]), [-1, 3, -3])
    assert.deepStrictEqual(sa.set(4)([-1, -2, 3]), [-1, -2, 4])
  })
})
