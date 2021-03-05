import { indexArray } from '../../src/Index/Array'
import { indexReadonlyArray } from '../../src/Index/ReadonlyArray'
import { indexNonEmptyArray } from '../../src/Index/NonEmptyArray'
import { indexReadonlyNonEmptyArray } from '../../src/Index/ReadonlyNonEmptyArray'
import { indexRecord } from '../../src/Index/Record'
import { indexReadonlyRecord } from '../../src/Index/ReadonlyRecord'
import { some, none } from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'
import { cons } from 'fp-ts/lib/NonEmptyArray'
import { Iso } from '../../src'
import * as U from '../util'

describe('Index', () => {
  describe('indexRecord', () => {
    const index = indexRecord<string>().index('key')

    it('get', () => {
      const map = R.singleton('key', 'value')
      U.deepStrictEqual(index.getOption(map), some('value'))
    })

    it('set if there', () => {
      const map = R.singleton('key', 'value')
      const newMap = index.set('new')(map)
      U.deepStrictEqual(newMap, R.singleton('key', 'new'))
    })

    it('leave if missing', () => {
      const map = {}
      const newMap = index.set('new')(map)
      U.deepStrictEqual(newMap, map)
    })
  })

  describe('indexReadonlyRecord', () => {
    const index = indexReadonlyRecord<string>().index('key')

    it('get', () => {
      const map = R.singleton('key', 'value')
      U.deepStrictEqual(index.getOption(map), some('value'))
    })

    it('set if there', () => {
      const map = R.singleton('key', 'value')
      const newMap = index.set('new')(map)
      U.deepStrictEqual(newMap, R.singleton('key', 'new'))
    })

    it('leave if missing', () => {
      const map = {}
      const newMap = index.set('new')(map)
      U.deepStrictEqual(newMap, map)
    })
  })

  describe('indexArray', () => {
    const one = indexArray<string>().index(1)

    it('get', () => {
      U.deepStrictEqual(one.getOption(['a']), none)
      U.deepStrictEqual(one.getOption(['a', 'b']), some('b'))
    })

    it('get', () => {
      U.deepStrictEqual(one.set('x')(['a']), ['a'])
      U.deepStrictEqual(one.set('x')(['a', 'b']), ['a', 'x'])
    })

    it('modify', () => {
      U.deepStrictEqual(one.modify((v) => `${v}X`)(['a']), ['a'])
      U.deepStrictEqual(one.modify((v) => `${v}X`)(['a', 'b']), ['a', 'bX'])
    })

    it('modifyOption', () => {
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(['a']), none)
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(['a', 'b']), some(['a', 'bX']))
    })
  })

  describe('indexReadonlyArray', () => {
    const one = indexReadonlyArray<string>().index(1)

    it('get', () => {
      U.deepStrictEqual(one.getOption(['a']), none)
      U.deepStrictEqual(one.getOption(['a', 'b']), some('b'))
    })

    it('get', () => {
      U.deepStrictEqual(one.set('x')(['a']), ['a'])
      U.deepStrictEqual(one.set('x')(['a', 'b']), ['a', 'x'])
    })

    it('modify', () => {
      U.deepStrictEqual(one.modify((v) => `${v}X`)(['a']), ['a'])
      U.deepStrictEqual(one.modify((v) => `${v}X`)(['a', 'b']), ['a', 'bX'])
    })

    it('modifyOption', () => {
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(['a']), none)
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(['a', 'b']), some(['a', 'bX']))
    })
  })

  describe('indexNonEmptyArray', () => {
    const one = indexNonEmptyArray<string>().index(1)

    it('get', () => {
      U.deepStrictEqual(one.getOption(cons('a', [])), none)
      U.deepStrictEqual(one.getOption(cons('a', ['b'])), some('b'))
    })

    it('get', () => {
      U.deepStrictEqual(one.set('x')(cons('a', [])), cons('a', []))
      U.deepStrictEqual(one.set('x')(cons('a', ['b'])), cons('a', ['x']))
    })

    it('modify', () => {
      U.deepStrictEqual(one.modify((v) => `${v}X`)(cons('a', [])), cons('a', []))
      U.deepStrictEqual(one.modify((v) => `${v}X`)(cons('a', ['b'])), cons('a', ['bX']))
    })

    it('modifyOption', () => {
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(cons('a', [])), none)
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(cons('a', ['b'])), some(cons('a', ['bX'])))
    })
  })

  describe('indexReadonlyNonEmptyArray', () => {
    const one = indexReadonlyNonEmptyArray<string>().index(1)

    it('get', () => {
      U.deepStrictEqual(one.getOption(cons('a', [])), none)
      U.deepStrictEqual(one.getOption(cons('a', ['b'])), some('b'))
    })

    it('get', () => {
      U.deepStrictEqual(one.set('x')(cons('a', [])), cons('a', []))
      U.deepStrictEqual(one.set('x')(cons('a', ['b'])), cons('a', ['x']))
    })

    it('modify', () => {
      U.deepStrictEqual(one.modify((v) => `${v}X`)(cons('a', [])), cons('a', []))
      U.deepStrictEqual(one.modify((v) => `${v}X`)(cons('a', ['b'])), cons('a', ['bX']))
    })

    it('modifyOption', () => {
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(cons('a', [])), none)
      U.deepStrictEqual(one.modifyOption((v) => `${v}X`)(cons('a', ['b'])), some(cons('a', ['bX'])))
    })
  })

  it('fromIso', () => {
    const iso = new Iso<Array<string>, Array<number>>(
      (s) => s.map((v) => +v),
      (a) => a.map(String)
    )
    const index = indexArray<number>().fromIso(iso).index(1)
    U.deepStrictEqual(index.getOption([]), none)
    U.deepStrictEqual(index.getOption(['1']), none)
    U.deepStrictEqual(index.getOption(['1', '2']), some(2))

    U.deepStrictEqual(index.set(3)([]), [])
    U.deepStrictEqual(index.set(3)(['1']), ['1'])
    U.deepStrictEqual(index.set(3)(['1', '2']), ['1', '3'])
  })
})
