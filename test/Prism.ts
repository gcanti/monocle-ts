import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import * as Id from 'fp-ts/lib/Identity'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/ReadonlyArray'
import { ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import * as Op from '../src/Optional'
import * as _ from '../src/Prism'
import * as T from '../src/Traversal'
import * as U from './util'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

type Leaf = {
  readonly _tag: 'Leaf'
}
type Node = {
  readonly _tag: 'Node'
  readonly value: number
  readonly left: Tree
  readonly right: Tree
}
type Tree = Leaf | Node

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

const leaf: Tree = { _tag: 'Leaf' }
const node = (value: number, left: Tree, right: Tree): Tree => ({ _tag: 'Node', value, left, right })

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

const value: _.Prism<Tree, number> = {
  getOption: (s) => (s._tag === 'Node' ? O.some(s.value) : O.none),
  reverseGet: (a) => node(a, leaf, leaf)
}

describe('Prism', () => {
  describe('pipeables', () => {
    it('imap', () => {
      const sa = pipe(
        value,
        _.imap(
          (n) => String(n),
          (s) => parseFloat(s)
        )
      )
      U.deepStrictEqual(sa.getOption(leaf), O.none)
      U.deepStrictEqual(sa.getOption(node(1, leaf, leaf)), O.some('1'))
      U.deepStrictEqual(sa.reverseGet('1'), node(1, leaf, leaf))
    })
  })

  describe('instances', () => {
    it('compose', () => {
      type S = O.Option<Tree>
      const sa = pipe(_.id<S>(), _.some)
      const ab = value
      const sb = _.Category.compose(ab, sa)
      U.deepStrictEqual(sb.getOption(O.none), O.none)
      U.deepStrictEqual(sb.getOption(O.some(leaf)), O.none)
      U.deepStrictEqual(sb.getOption(O.some(node(1, leaf, leaf))), O.some(1))
      U.deepStrictEqual(sb.reverseGet(1), O.some(node(1, leaf, leaf)))
    })
  })

  it('id', () => {
    const ss = _.id<Tree>()
    U.deepStrictEqual(ss.getOption(leaf), O.some(leaf))
    U.deepStrictEqual(ss.reverseGet(leaf), leaf)
  })

  it('modify', () => {
    const modify = pipe(
      value,
      _.modify((value) => value * 2)
    )
    U.deepStrictEqual(modify(leaf), leaf)
    U.deepStrictEqual(modify(node(1, leaf, leaf)), node(2, leaf, leaf))
  })

  it('modifyOption', () => {
    const modifyOption = pipe(
      value,
      _.modifyOption((value) => value * 2)
    )
    U.deepStrictEqual(modifyOption(leaf), O.none)
    U.deepStrictEqual(modifyOption(node(1, leaf, leaf)), O.some(node(2, leaf, leaf)))
  })

  it('prop', () => {
    type S = O.Option<{
      readonly a: string
      readonly b: number
    }>
    const sa = pipe(_.id<S>(), _.some, _.prop('a'))
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1 })), O.some('a'))
  })

  it('pick', () => {
    type S = O.Option<{
      readonly a: string
      readonly b: number
      readonly c: boolean
    }>
    const sa = pipe(_.id<S>(), _.some, _.pick('a', 'b'))
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 1 }))
  })

  it('omit', () => {
    type S = O.Option<{
      readonly a: string
      readonly b: number
      readonly c: boolean
    }>
    const sa = pipe(_.id<S>(), _.some, _.omit('c'))
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 1 }))
  })

  it('component', () => {
    type S = O.Option<readonly [string, number]>
    const sa = pipe(_.id<S>(), _.some, _.component(1))
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some(['a', 1])), O.some(1))
  })

  it('index', () => {
    type S = ReadonlyArray<number>
    const optional = pipe(_.id<S>(), _.index(0))
    U.deepStrictEqual(optional.getOption([]), O.none)
    U.deepStrictEqual(optional.getOption([1]), O.some(1))
    U.deepStrictEqual(optional.set(2)([]), [])
    U.deepStrictEqual(optional.set(2)([1]), [2])
    // should return the same reference
    const empty: S = []
    const full: S = [1]
    assert.strictEqual(optional.set(1)(empty), empty)
    assert.strictEqual(optional.set(1)(full), full)
  })

  it('indexNonEmpty', () => {
    type S = ReadonlyNonEmptyArray<number>
    const optional = pipe(_.id<S>(), _.indexNonEmpty(1))
    U.deepStrictEqual(optional.getOption([1, 2]), O.some(2))
    U.deepStrictEqual(optional.set(3)([1]), [1])
    U.deepStrictEqual(optional.set(3)([1, 2]), [1, 3])
    // should return the same reference
    const full: S = [1, 2]
    assert.strictEqual(optional.set(2)(full), full)
  })

  it('key', () => {
    const sa = pipe(_.id<ReadonlyRecord<string, number>>(), _.key('k'))
    U.deepStrictEqual(sa.getOption({ k: 1, j: 2 }), O.some(1))
  })

  it('compose', () => {
    type S = O.Option<Tree>
    const sa = pipe(_.id<S>(), _.some)
    const ab = value
    const sb = pipe(sa, _.compose(ab))
    U.deepStrictEqual(sb.getOption(O.none), O.none)
    U.deepStrictEqual(sb.getOption(O.some(leaf)), O.none)
    U.deepStrictEqual(sb.getOption(O.some(node(1, leaf, leaf))), O.some(1))
    U.deepStrictEqual(sb.reverseGet(1), O.some(node(1, leaf, leaf)))
  })

  it('composeOptional', () => {
    type S = O.Option<string>
    const sa = pipe(_.id<S>(), _.some)
    const ab: Op.Optional<string, string> = Op.optional(
      (s) => (s.length > 0 ? O.some(s[0]) : O.none),
      (a) => (s) => (s.length > 0 ? a + s.substring(1) : s)
    )
    const sb = pipe(sa, _.composeOptional(ab))
    U.deepStrictEqual(sb.getOption(O.none), O.none)
    U.deepStrictEqual(sb.getOption(O.some('')), O.none)
    U.deepStrictEqual(sb.getOption(O.some('ab')), O.some('a'))
    U.deepStrictEqual(sb.set('c')(O.none), O.none)
    U.deepStrictEqual(sb.set('c')(O.some('')), O.some(''))
    U.deepStrictEqual(sb.set('c')(O.some('ab')), O.some('cb'))
  })

  it('composeTraversal', () => {
    type S = O.Option<ReadonlyArray<number>>
    const sa = pipe(_.id<S>(), _.some)
    const ab = T.fromTraversable(A.readonlyArray)<number>()
    const sb = pipe(sa, _.composeTraversal(ab))
    U.deepStrictEqual(sb.modifyF(Id.identity)((n) => n * 2)(O.none), O.none)
    U.deepStrictEqual(sb.modifyF(Id.identity)((n) => n * 2)(O.some([1, 2, 3])), O.some([2, 4, 6]))
  })

  it('right', () => {
    type S = E.Either<string, number>
    const sa = pipe(_.id<S>(), _.right)
    U.deepStrictEqual(sa.getOption(E.right(1)), O.some(1))
    U.deepStrictEqual(sa.getOption(E.left('a')), O.none)
    U.deepStrictEqual(sa.reverseGet(2), E.right(2))
  })

  it('left', () => {
    type S = E.Either<string, number>
    const sa = pipe(_.id<S>(), _.left)
    U.deepStrictEqual(sa.getOption(E.right(1)), O.none)
    U.deepStrictEqual(sa.getOption(E.left('a')), O.some('a'))
    U.deepStrictEqual(sa.reverseGet('b'), E.left('b'))
  })

  it('atKey', () => {
    type S = ReadonlyRecord<string, number>
    const sa = pipe(_.id<S>(), _.atKey('a'))
    U.deepStrictEqual(sa.getOption({ a: 1 }), O.some(O.some(1)))
    U.deepStrictEqual(sa.set(O.some(2))({ a: 1, b: 2 }), { a: 2, b: 2 })
    U.deepStrictEqual(sa.set(O.some(1))({ b: 2 }), { a: 1, b: 2 })
    U.deepStrictEqual(sa.set(O.none)({ a: 1, b: 2 }), { b: 2 })
  })

  it('filter', () => {
    type S = O.Option<number>
    const sa = pipe(
      _.id<S>(),
      _.some,
      _.filter((n) => n > 0)
    )
    U.deepStrictEqual(sa.getOption(O.some(1)), O.some(1))
    U.deepStrictEqual(sa.getOption(O.some(-1)), O.none)
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.reverseGet(2), O.some(2))
    U.deepStrictEqual(sa.reverseGet(-1), O.some(-1))
  })

  it('findFirst', () => {
    type S = O.Option<ReadonlyArray<number>>
    const optional = pipe(
      _.id<S>(),
      _.some,
      _.findFirst((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption(O.none), O.none)
    U.deepStrictEqual(optional.getOption(O.some([])), O.none)
    U.deepStrictEqual(optional.getOption(O.some([-1, -2, -3])), O.none)
    U.deepStrictEqual(optional.getOption(O.some([-1, 2, -3])), O.some(2))
    U.deepStrictEqual(optional.set(3)(O.none), O.none)
    U.deepStrictEqual(optional.set(3)(O.some([])), O.some([]))
    U.deepStrictEqual(optional.set(3)(O.some([-1, -2, -3])), O.some([-1, -2, -3]))
    U.deepStrictEqual(optional.set(3)(O.some([-1, 2, -3])), O.some([-1, 3, -3]))
    U.deepStrictEqual(optional.set(4)(O.some([-1, -2, 3])), O.some([-1, -2, 4]))
  })

  it('findFirstNonEmpty', () => {
    type S = O.Option<ReadonlyNonEmptyArray<number>>
    const optional = pipe(
      _.id<S>(),
      _.some,
      _.findFirstNonEmpty((n) => n > 0)
    )
    U.deepStrictEqual(optional.getOption(O.none), O.none)
    U.deepStrictEqual(optional.getOption(O.some([-1, -2, -3])), O.none)
    U.deepStrictEqual(optional.getOption(O.some([-1, 2, -3])), O.some(2))
    U.deepStrictEqual(optional.set(3)(O.none), O.none)
    U.deepStrictEqual(optional.set(3)(O.some([-1, -2, -3])), O.some([-1, -2, -3] as const))
    U.deepStrictEqual(optional.set(3)(O.some([-1, 2, -3])), O.some([-1, 3, -3] as const))
    U.deepStrictEqual(optional.set(4)(O.some([-1, -2, 3])), O.some([-1, -2, 4] as const))
  })

  it('traverse', () => {
    type S = O.Option<ReadonlyArray<string>>
    const sa = pipe(_.id<S>(), _.some, _.traverse(A.readonlyArray))
    const modify = pipe(
      sa,
      T.modify((s) => s.toUpperCase())
    )
    U.deepStrictEqual(modify(O.some(['a'])), O.some(['A']))
  })

  it('fromNullable', () => {
    type S = O.Option<number | undefined>
    const sa = pipe(_.id<S>(), _.some, _.fromNullable)
    U.deepStrictEqual(sa.getOption(O.none), O.none)
    U.deepStrictEqual(sa.getOption(O.some(undefined)), O.none)
    U.deepStrictEqual(sa.getOption(O.some(1)), O.some(1))
    U.deepStrictEqual(sa.reverseGet(1), O.some(1))
  })

  it('modifyF', () => {
    const f = pipe(
      value,
      _.modifyF(O.option)((n) => (n > 0 ? O.some(n * 2) : O.none))
    )
    U.deepStrictEqual(f(node(1, leaf, leaf)), O.some(node(2, leaf, leaf)))
    U.deepStrictEqual(f(leaf), O.some(leaf))
    U.deepStrictEqual(f(node(-1, leaf, leaf)), O.none)
  })
})
