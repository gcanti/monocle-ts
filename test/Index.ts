import { indexArray } from '../src/Index/Array'
import { indexNonEmptyArray } from '../src/Index/NonEmptyArray'
import { indexStrMap } from '../src/Index/StrMap'
import * as assert from 'assert'
import { some, none } from 'fp-ts/lib/Option'
import * as SM from 'fp-ts/lib/StrMap'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

describe('Index', () => {
  describe('indexStrMap', () => {
    const index = indexStrMap<string>().index('key')

    it('get', () => {
      const map = SM.singleton('key', 'value')
      assert.deepEqual(index.getOption(map), some('value'))
    })

    it('set if there', () => {
      const map = SM.singleton('key', 'value')
      const newMap = index.set('new')(map)
      assert.deepEqual(newMap, SM.singleton('key', 'new'))
    })

    it('leave if missing', () => {
      const map = new SM.StrMap<string>({})
      const newMap = index.set('new')(map)
      assert.deepEqual(newMap, map)
    })
  })

  describe('indexArray', () => {
    const atOne = indexArray<string>().index(1)

    it('get', () => {
      assert.deepEqual(atOne.getOption(['a']), none)
      assert.deepEqual(atOne.getOption(['a', 'b']), some('b'))
    })

    it('get', () => {
      assert.deepEqual(atOne.set('x')(['a']), ['a'])
      assert.deepEqual(atOne.set('x')(['a', 'b']), ['a', 'x'])
    })

    it('modify', () => {
      assert.deepEqual(atOne.modify(v => `${v}X`)(['a']), ['a'])
      assert.deepEqual(atOne.modify(v => `${v}X`)(['a', 'b']), ['a', 'bX'])
    })

    it('modifyOption', () => {
      assert.deepEqual(atOne.modifyOption(v => `${v}X`)(['a']), none)
      assert.deepEqual(atOne.modifyOption(v => `${v}X`)(['a', 'b']), some(['a', 'bX']))
    })
  })

  describe('indexNonEmptyArray', () => {
    const atOne = indexNonEmptyArray<string>().index(1)

    it('get', () => {
      assert.deepEqual(atOne.getOption(new NonEmptyArray('a', [])), none)
      assert.deepEqual(atOne.getOption(new NonEmptyArray('a', ['b'])), some('b'))
    })

    it('get', () => {
      assert.deepEqual(atOne.set('x')(new NonEmptyArray('a', [])), new NonEmptyArray('a', []))
      assert.deepEqual(atOne.set('x')(new NonEmptyArray('a', ['b'])), new NonEmptyArray('a', ['x']))
    })

    it('modify', () => {
      assert.deepEqual(atOne.modify(v => `${v}X`)(new NonEmptyArray('a', [])), new NonEmptyArray('a', []))
      assert.deepEqual(atOne.modify(v => `${v}X`)(new NonEmptyArray('a', ['b'])), new NonEmptyArray('a', ['bX']))
    })

    it('modifyOption', () => {
      assert.deepEqual(atOne.modifyOption(v => `${v}X`)(new NonEmptyArray('a', [])), none)
      assert.deepEqual(
        atOne.modifyOption(v => `${v}X`)(new NonEmptyArray('a', ['b'])),
        some(new NonEmptyArray('a', ['bX']))
      )
    })
  })
})
