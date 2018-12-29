import { atSet } from '../src/At/Set'
import { atStrMap } from '../src/At/StrMap'
import * as assert from 'assert'
import { none, some } from 'fp-ts/lib/Option'
import { setoidNumber } from 'fp-ts/lib/Setoid'
import * as S from 'fp-ts/lib/Set'
import * as SM from 'fp-ts/lib/StrMap'
import { Iso } from '../src'

describe('At', () => {
  describe('atStrMap', () => {
    const map = SM.singleton('key', 'value')
    const at = atStrMap<string>().at('key')

    it('get', () => {
      assert.deepEqual(at.get(map), some('value'))
    })

    it('add', () => {
      const newMap = at.set(some('NEW'))(map)

      assert.deepEqual(newMap, SM.singleton('key', 'NEW'))
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
      assert.deepEqual(at.get(set), true)
    })

    it('add', () => {
      const newSet = at.set(true)(set)

      assert.deepEqual(newSet, set)
    })

    it('delete', () => {
      const newSet = at.set(false)(set)

      assert.deepEqual(newSet, new Set())
    })
  })

  it('fromIso', () => {
    const iso = new Iso<SM.StrMap<string>, SM.StrMap<number>>(s => s.map(v => +v), a => a.map(String))
    const at = atStrMap<number>()
      .fromIso(iso)
      .at('a')
    assert.deepEqual(at.get(new SM.StrMap({})), none)
    assert.deepEqual(at.get(new SM.StrMap({ a: '1' })), some(1))

    assert.deepEqual(at.set(none)(new SM.StrMap({})), new SM.StrMap({}))
    assert.deepEqual(at.set(some(1))(new SM.StrMap({})), new SM.StrMap({ a: '1' }))
  })
})
