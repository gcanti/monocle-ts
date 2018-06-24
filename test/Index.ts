import { indexArray } from '../src/Index/Array'
import { indexStrMap } from '../src/Index/StrMap'
import * as assert from 'assert'
import { some } from 'fp-ts/lib/Option'
import * as SM from 'fp-ts/lib/StrMap'

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

  describe('indexStrMap', () => {
    const index = indexArray<string>().index(0)

    it('get', () => {
      const arr = ['test']

      assert.deepEqual(index.getOption(arr), some('test'))
    })

    it('set if there', () => {
      const arr = ['test']
      const newArr = index.set('new')(arr)

      assert.deepEqual(newArr, ['new'])
    })

    it('leave if missing', () => {
      const arr: Array<string> = []
      const newArr = index.set('new')(arr)

      assert.deepEqual(newArr, arr)
    })
  })
})
