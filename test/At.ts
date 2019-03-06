import { atRecord } from '../src/At/Record'
import { atSet } from '../src/At/Set'
import { atStrMap } from '../src/At/StrMap'
import * as assert from 'assert'
import { none, some } from 'fp-ts/lib/Option'
import { setoidNumber } from 'fp-ts/lib/Setoid'
import * as R from 'fp-ts/lib/Record'
import * as S from 'fp-ts/lib/Set'
import * as SM from 'fp-ts/lib/StrMap'
import { Iso } from '../src'

describe('At', () => {
  describe('atRecord', () => {
    const map = R.singleton('key', 'value')
    const at = atRecord<string>().at('key')

    it('get', () => {
      assert.deepStrictEqual(at.get(map), some('value'))
    })

    it('add', () => {
      const newMap = at.set(some('NEW'))(map)

      assert.deepStrictEqual(newMap, R.singleton('key', 'NEW'))
    })

    it('delete', () => {
      const newMap = at.set(none)(map)

      assert(R.isEmpty(newMap))
    })
  })

  describe('atStrMap', () => {
    const map = SM.singleton('key', 'value')
    const at = atStrMap<string>().at('key')

    it('get', () => {
      assert.deepStrictEqual(at.get(map), some('value'))
    })

    it('add', () => {
      const newMap = at.set(some('NEW'))(map)

      assert.deepStrictEqual(newMap, SM.singleton('key', 'NEW'))
    })

    it('delete', () => {
      const newMap = at.set(none)(map)

      assert(SM.isEmpty(newMap))
    })
  })

  describe('atSet', () => {
    const set = S.singleton(3)
    const at = atSet(setoidNumber).at(3)

    it('get', () => {
      assert.deepStrictEqual(at.get(set), true)
    })

    it('add', () => {
      const newSet = at.set(true)(set)

      assert.deepStrictEqual(newSet, set)
    })

    it('delete', () => {
      const newSet = at.set(false)(set)

      assert.deepStrictEqual(newSet, new Set())
    })
  })

  it('fromIso', () => {
    const iso = new Iso<SM.StrMap<string>, SM.StrMap<number>>(s => s.map(v => +v), a => a.map(String))
    const at = atStrMap<number>()
      .fromIso(iso)
      .at('a')
    assert.deepStrictEqual(at.get(new SM.StrMap({})), none)
    assert.deepStrictEqual(at.get(new SM.StrMap({ a: '1' })), some(1))

    assert.deepStrictEqual(at.set(none)(new SM.StrMap({})), new SM.StrMap({}))
    assert.deepStrictEqual(at.set(some(1))(new SM.StrMap({})), new SM.StrMap({ a: '1' }))
  })
})
