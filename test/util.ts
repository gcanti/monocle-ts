import * as assert from 'assert'
import { shallowCopy } from '../src/util'

describe('util', () => {
  describe('shallowCopy', () => {
    it('copy raw object as-is', () => {
      const actual = shallowCopy({ foo: 1, bar: 'a' })
      const expected = { foo: 1, bar: 'a' }

      assert.deepEqual(actual, expected)
    })

    it('copy raw object and change existing properties', () => {
      const actual = shallowCopy({ foo: 1, bar: 'a' }, { foo: 2, bar: 'b' })
      const expected = { foo: 2, bar: 'b' }

      assert.deepEqual(actual, expected)
    })

    it('copy raw object and add new properties', () => {
      const actual = shallowCopy({ foo: 1, bar: 'a' }, { baz: true })
      const expected = { foo: 1, bar: 'a', baz: true }

      assert.deepEqual(actual, expected)
    })

    it('copy array as-is', () => {
      const actual = shallowCopy([1, 'a'])
      const expected = [1, 'a']

      assert.deepEqual(actual, expected)
      assert(Array.isArray(actual))
    })

    it('copy array and change existing properties', () => {
      const actual = shallowCopy([1, 'a'], { 0: 2, 1: 'b' })
      const expected = [2, 'b']

      assert.deepEqual(actual, expected)
      assert(Array.isArray(actual))
    })

    it('copy array and add new properties', () => {
      const actual = shallowCopy([1, 'a'], { 2: true })
      const expected = [1, 'a', true]

      assert.deepEqual(actual, expected)
      assert(Array.isArray(actual))
    })

    it('copy class instance as-is', () => {
      class FooBar {
        constructor(readonly foo: number, readonly bar: string) {}
      }

      const actual = shallowCopy(new FooBar(1, 'a'))
      const expected = new FooBar(1, 'a')

      assert.deepEqual(actual, expected)
      assert(actual instanceof FooBar)
    })

    it('copy class instance and change existing properties', () => {
      class FooBar {
        constructor(readonly foo: number, readonly bar: string) {}
      }

      const actual = shallowCopy(new FooBar(1, 'a'), { foo: 2, bar: 'b' })
      const expected = new FooBar(2, 'b')

      assert.deepEqual(actual, expected)
      assert(actual instanceof FooBar)
    })

    it("copy class instance but don't add new properties", () => {
      class FooBar {
        constructor(readonly foo: number, readonly bar: string) {}
      }

      const actual = shallowCopy(new FooBar(1, 'a'), { baz: true })
      const expected = new FooBar(1, 'a')

      assert.deepEqual(actual, expected)
      assert(actual instanceof FooBar)
    })
  })
})
