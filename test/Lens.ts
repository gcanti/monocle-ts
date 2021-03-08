import * as assert from 'assert'
import * as _ from '../src/Lens'
import { identity, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'
import * as T from '../src/Traversal'
import * as Op from '../src/Optional'
import * as Id from 'fp-ts/Identity'
import * as U from './util'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'

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
      U.deepStrictEqual(sa.get({ a: 1 }), 1)
      U.deepStrictEqual(sa.set(2)({ a: 1 }), { a: 2 })
    })
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
    const sb = _.Category.compose(ab)(sa)
    U.deepStrictEqual(sb.get({ a: { b: 1 } }), 1)
    U.deepStrictEqual(sb.set(2)({ a: { b: 1 } }), { a: { b: 2 } })
  })

  it('composeTraversal', () => {
    interface S {
      readonly a: ReadonlyArray<number>
    }
    const sa = pipe(_.id<S>(), _.prop('a'))
    const ab = T.fromTraversable(A.Traversable)<number>()
    const sb = pipe(sa, _.composeTraversal(ab))
    U.deepStrictEqual(sb.modifyF(Id.Applicative)((n) => n * 2)({ a: [1, 2, 3] }), { a: [2, 4, 6] })
  })

  it('id', () => {
    interface S {
      readonly a: number
    }
    const ss = _.id<S>()
    const s: S = { a: 1 }
    U.deepStrictEqual(ss.get(s), s)
    U.deepStrictEqual(ss.set(s)(s), s)
  })

  it('fromNullable', () => {
    interface S {
      readonly a?: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.fromNullable)
    const s: S = { a: 1 }
    U.deepStrictEqual(sa.getOption(s), O.some(1))
    U.deepStrictEqual(sa.getOption({}), O.none)
    // should return the same reference
    assert.strictEqual(sa.replace(1)(s), s)
  })

  it('modify', () => {
    interface S {
      readonly a: number
    }
    const sa = pipe(_.id<S>(), _.prop('a'))
    U.deepStrictEqual(
      pipe(
        sa,
        _.modify((a) => a * 2)
      )({ a: 1 }),
      { a: 2 }
    )
    U.deepStrictEqual(pipe(sa, _.modify(identity))({ a: 1 }), { a: 1 })
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
    U.deepStrictEqual(sa.set(2)(s), { a: { b: 2 } })
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
    U.deepStrictEqual(sa.get(s), { b: 'b', c: 1 })
    U.deepStrictEqual(sa.set({ b: 'b', c: 2 })(s), { a: { b: 'b', c: 2, d: true } })
    // should return the same reference
    assert.strictEqual(sa.set({ b: 'b', c: 1 })(s), s)
  })

  it('component', () => {
    interface S {
      readonly a: readonly [string, number]
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.component(1))
    const s: S = { a: ['a', 1] }
    assert.strictEqual(sa.get(s), 1)
    U.deepStrictEqual(sa.set(2)(s), { a: ['a', 2] })
    // should return the same reference
    assert.strictEqual(sa.set(1)(s), s)
  })

  it('index', () => {
    interface S {
      readonly a: ReadonlyArray<number>
    }
    const optional = pipe(_.id<S>(), _.prop('a'), _.index(0))
    U.deepStrictEqual(optional.getOption({ a: [] }), O.none)
    U.deepStrictEqual(optional.getOption({ a: [1] }), O.some(1))
    U.deepStrictEqual(optional.replace(2)({ a: [] }), { a: [] })
    U.deepStrictEqual(optional.replace(2)({ a: [1] }), { a: [2] })
    // should return the same reference
    const empty: S = { a: [] }
    const full: S = { a: [1] }
    assert.strictEqual(optional.replace(1)(empty), empty)
    assert.strictEqual(optional.replace(1)(full), full)
  })

  it('indexNonEmpty', () => {
    interface S {
      readonly a: ReadonlyNonEmptyArray<number>
    }
    const optional = pipe(_.id<S>(), _.prop('a'), _.indexNonEmpty(1))
    U.deepStrictEqual(optional.getOption({ a: [1] }), O.none)
    U.deepStrictEqual(optional.getOption({ a: [1, 2] }), O.some(2))
    U.deepStrictEqual(optional.replace(3)({ a: [1] }), { a: [1] })
    U.deepStrictEqual(optional.replace(3)({ a: [1, 2] }), { a: [1, 3] })
    // should return the same reference
    const full: S = { a: [1, 2] }
    assert.strictEqual(optional.replace(2)(full), full)
  })

  it('key', () => {
    interface S {
      readonly a: ReadonlyRecord<string, number>
    }
    const sa = pipe(_.id<S>(), _.prop('a'), _.key('k'))
    const empty: S = { a: {} }
    const full: S = { a: { k: 1, j: 2 } }
    U.deepStrictEqual(sa.getOption(empty), O.none)
    U.deepStrictEqual(sa.getOption(full), O.some(1))
    U.deepStrictEqual(sa.replace(2)(full), { a: { k: 2, j: 2 } })
    // should return the same reference
    assert.strictEqual(sa.replace(2)(empty), empty)
    assert.strictEqual(sa.replace(1)(full), full)
  })

  it('traverse', () => {
    type S = ReadonlyArray<string>
    const sa = pipe(_.id<S>(), _.traverse(A.Traversable))
    const modify = pipe(
      sa,
      T.modify((s) => s.toUpperCase())
    )
    U.deepStrictEqual(modify(['a']), ['A'])
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
    U.deepStrictEqual(sb.get({ a: { b: 1 } }), 1)
    U.deepStrictEqual(sb.set(2)({ a: { b: 1 } }), { a: { b: 2 } })
  })

  it('composeOptional', () => {
    interface S {
      readonly a: string
    }
    const sa = pipe(_.id<S>(), _.prop('a'))
    const ab: Op.Optional<string, string> = Op.optional(
      (s) => (s.length > 0 ? O.some(s[0]) : O.none),
      (a) => (s) => (s.length > 0 ? a + s.substring(1) : s)
    )
    const sb = pipe(sa, _.composeOptional(ab))
    U.deepStrictEqual(sb.getOption({ a: '' }), O.none)
    U.deepStrictEqual(sb.getOption({ a: 'ab' }), O.some('a'))
    U.deepStrictEqual(sb.replace('c')({ a: '' }), { a: '' })
    U.deepStrictEqual(sb.replace('c')({ a: 'ab' }), { a: 'cb' })
  })

  it('atKey', () => {
    type S = ReadonlyRecord<string, number>
    const sa = pipe(_.id<S>(), _.atKey('a'))
    U.deepStrictEqual(sa.get({ a: 1 }), O.some(1))
    U.deepStrictEqual(sa.set(O.some(2))({ a: 1, b: 2 }), { a: 2, b: 2 })
    U.deepStrictEqual(sa.set(O.some(1))({ b: 2 }), { a: 1, b: 2 })
    U.deepStrictEqual(sa.set(O.none)({ a: 1, b: 2 }), { b: 2 })
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
    U.deepStrictEqual(sa.getOption({ a: 1 }), O.some(1))
    U.deepStrictEqual(sa.getOption({ a: -1 }), O.none)
    U.deepStrictEqual(sa.replace(2)({ a: 1 }), { a: 2 })
    U.deepStrictEqual(sa.replace(2)({ a: -1 }), { a: -1 })
  })

  it('findFirst', () => {
    type S = ReadonlyArray<number>
    const optional = pipe(
      _.id<S>(),
      _.findFirst((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption([]), O.none)
    U.deepStrictEqual(optional.getOption([-1, -2, -3]), O.none)
    U.deepStrictEqual(optional.getOption([-1, 2, -3]), O.some(2))
    U.deepStrictEqual(optional.replace(3)([]), [])
    U.deepStrictEqual(optional.replace(3)([-1, -2, -3]), [-1, -2, -3])
    U.deepStrictEqual(optional.replace(3)([-1, 2, -3]), [-1, 3, -3])
    U.deepStrictEqual(optional.replace(4)([-1, -2, 3]), [-1, -2, 4])
  })

  it('findFirstNonEmpty', () => {
    type S = ReadonlyNonEmptyArray<number>
    const optional = pipe(
      _.id<S>(),
      _.findFirstNonEmpty((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption([-1, -2, -3]), O.none)
    U.deepStrictEqual(optional.getOption([-1, 2, -3]), O.some(2))
    U.deepStrictEqual(optional.replace(3)([-1, -2, -3]), [-1, -2, -3])
    U.deepStrictEqual(optional.replace(3)([-1, 2, -3]), [-1, 3, -3])
    U.deepStrictEqual(optional.replace(4)([-1, -2, 3]), [-1, -2, 4])
  })

  it('modifyF', () => {
    interface S {
      readonly a: number
    }
    const sa: _.Lens<S, number> = pipe(_.id<S>(), _.prop('a'))
    const f = pipe(
      sa,
      _.modifyF(O.Applicative)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    U.deepStrictEqual(f({ a: 1 }), O.some({ a: 2 }))
    U.deepStrictEqual(f({ a: -1 }), O.none)
  })
})
