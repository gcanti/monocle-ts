import * as assert from 'assert'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as _ from '../src/Prism'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

type Leaf = { _tag: 'Leaf' }
type Node = { _tag: 'Node'; value: number; left: Tree; right: Tree }
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
      assert.deepStrictEqual(sa.getOption(leaf), O.none)
      assert.deepStrictEqual(sa.getOption(node(1, leaf, leaf)), O.some('1'))
      assert.deepStrictEqual(sa.reverseGet('1'), node(1, leaf, leaf))
    })
  })

  describe('instances', () => {
    it('compose', () => {
      type S = O.Option<Tree>
      const sa = pipe(_.id<S>(), _.some)
      const ab = value
      const sb = _.categoryPrism.compose(ab, sa)
      assert.deepStrictEqual(sb.getOption(O.none), O.none)
      assert.deepStrictEqual(sb.getOption(O.some(leaf)), O.none)
      assert.deepStrictEqual(sb.getOption(O.some(node(1, leaf, leaf))), O.some(1))
      assert.deepStrictEqual(sb.reverseGet(1), O.some(node(1, leaf, leaf)))
    })
  })

  it('id', () => {
    const ss = _.id<Tree>()
    assert.deepStrictEqual(ss.getOption(leaf), O.some(leaf))
    assert.deepStrictEqual(ss.reverseGet(leaf), leaf)
  })

  it('modify', () => {
    const modify = pipe(
      value,
      _.modify((value) => value * 2)
    )
    assert.deepStrictEqual(modify(leaf), leaf)
    assert.deepStrictEqual(modify(node(1, leaf, leaf)), node(2, leaf, leaf))
  })

  it('modifyOption', () => {
    const modifyOption = pipe(
      value,
      _.modifyOption((value) => value * 2)
    )
    assert.deepStrictEqual(modifyOption(leaf), O.none)
    assert.deepStrictEqual(modifyOption(node(1, leaf, leaf)), O.some(node(2, leaf, leaf)))
  })

  it('prop', () => {
    type S = O.Option<Tree>
    const sa = pipe(_.id<S>(), _.some, _.prop('_tag'))
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some(leaf)), O.some('Leaf'))
    assert.deepStrictEqual(sa.getOption(O.some(node(1, leaf, leaf))), O.some('Node'))
  })

  it('props', () => {
    type S = O.Option<{ a: string; b: number; c: boolean }>
    const sa = pipe(_.id<S>(), _.some, _.props('a', 'b'))
    assert.deepStrictEqual(sa.getOption(O.none), O.none)
    assert.deepStrictEqual(sa.getOption(O.some({ a: 'a', b: 1, c: true })), O.some({ a: 'a', b: 1 }))
  })

  it('composePrism', () => {
    type S = O.Option<Tree>
    const sa = pipe(_.id<S>(), _.some)
    const ab = value
    const sb = pipe(sa, _.composePrism(ab))
    assert.deepStrictEqual(sb.getOption(O.none), O.none)
    assert.deepStrictEqual(sb.getOption(O.some(leaf)), O.none)
    assert.deepStrictEqual(sb.getOption(O.some(node(1, leaf, leaf))), O.some(1))
    assert.deepStrictEqual(sb.reverseGet(1), O.some(node(1, leaf, leaf)))
  })
})
