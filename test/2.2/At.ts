import { atRecord } from '../../src/At/Record'
import { atReadonlyRecord } from '../../src/At/ReadonlyRecord'
import { atSet } from '../../src/At/Set'
import { atReadonlySet } from '../../src/At/ReadonlySet'
import * as assert from 'assert'
import { none, some } from 'fp-ts/lib/Option'
import { eqNumber } from 'fp-ts/lib/Eq'
import * as R from 'fp-ts/lib/Record'
import * as S from 'fp-ts/lib/Set'
import { Iso } from '../../src'
import * as U from '../util'

describe('At', () => {
  describe('atRecord', () => {
    const map = R.singleton('key', 'value')
    const at = atRecord<string>().at('key')

    it('get', () => {
      U.deepStrictEqual(at.get(map), some('value'))
    })

    it('add', () => {
      const newMap = at.set(some('NEW'))(map)
      U.deepStrictEqual(newMap, R.singleton('key', 'NEW'))
    })

    it('delete', () => {
      const newMap = at.set(none)(map)
      assert(R.isEmpty(newMap))
    })
  })

  describe('atReadonlyRecord', () => {
    const map = R.singleton('key', 'value')
    const at = atReadonlyRecord<string>().at('key')

    it('get', () => {
      U.deepStrictEqual(at.get(map), some('value'))
    })

    it('add', () => {
      const newMap = at.set(some('NEW'))(map)
      U.deepStrictEqual(newMap, R.singleton('key', 'NEW'))
    })

    it('delete', () => {
      const newMap = at.set(none)(map)
      assert(R.isEmpty(newMap))
    })
  })

  describe('atSet', () => {
    const set = S.singleton(3)
    const at = atSet(eqNumber).at(3)

    it('get', () => {
      U.deepStrictEqual(at.get(set), true)
    })

    it('add', () => {
      const newSet = at.set(true)(set)
      U.deepStrictEqual(newSet, set)
    })

    it('delete', () => {
      const newSet = at.set(false)(set)
      U.deepStrictEqual(newSet, new Set())
    })
  })

  describe('atReadonlySet', () => {
    const set = S.singleton(3)
    const at = atReadonlySet(eqNumber).at(3)

    it('get', () => {
      U.deepStrictEqual(at.get(set), true)
    })

    it('add', () => {
      const newSet = at.set(true)(set)
      U.deepStrictEqual(newSet, set)
    })

    it('delete', () => {
      const newSet = at.set(false)(set)
      U.deepStrictEqual(newSet, new Set())
    })
  })

  it('fromIso', () => {
    const iso = new Iso<Record<string, string>, Record<string, number>>(
      R.map((v) => +v),
      R.map(String)
    )
    const at = atRecord<number>().fromIso(iso).at('a')
    U.deepStrictEqual(at.get({}), none)
    U.deepStrictEqual(at.get({ a: '1' }), some(1))

    U.deepStrictEqual(at.set(none)({}), {})
    U.deepStrictEqual(at.set(some(1))({}), { a: '1' })
  })
})
