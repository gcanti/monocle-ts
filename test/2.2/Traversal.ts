import { Lens, fromTraversable } from '../../src'
import { array } from 'fp-ts/lib/Array'
import { Option, isSome, some, Some } from 'fp-ts/lib/Option'
import * as U from '../util'

describe('Traversal', () => {
  it('fromTraversable', () => {
    interface Tweet {
      readonly text: string
    }

    interface Tweets {
      readonly tweets: Array<Tweet>
    }

    const tweetsLens = Lens.fromProp<Tweets>()('tweets')
    const tweetTextLens = Lens.fromProp<Tweet>()('text')
    const tweetTraversal = fromTraversable(array)<Tweet>()
    const composedTraversal = tweetsLens.composeTraversal(tweetTraversal).composeLens(tweetTextLens)

    const tweet1: Tweet = { text: 'hello world' }
    const tweet2: Tweet = { text: 'foobar' }
    const model: Tweets = { tweets: [tweet1, tweet2] }

    const newModel = composedTraversal.modify((text) => text.split('').reverse().join(''))(model)
    U.deepStrictEqual(newModel, { tweets: [{ text: 'dlrow olleh' }, { text: 'raboof' }] })
  })

  it('set', () => {
    const traversal = fromTraversable(array)<string>()
    U.deepStrictEqual(traversal.set('a')([]), [])
    U.deepStrictEqual(traversal.set('a')(['b', 'c']), ['a', 'a'])
  })

  it('filter', () => {
    const traversal1 = fromTraversable(array)<string>().filter((s) => s.length > 2)
    U.deepStrictEqual(traversal1.set('a')([]), [])
    U.deepStrictEqual(traversal1.set('a')(['b', 'c']), ['b', 'c'])
    U.deepStrictEqual(traversal1.set('a')(['b', 'foo', 'c']), ['b', 'a', 'c'])

    const traversal2 = fromTraversable(array)<Option<number>>()
      .filter(isSome)
      .filter((o) => o.value > 2)
    U.deepStrictEqual(traversal2.set(some(2) as Some<number>)([]), [])
    U.deepStrictEqual(traversal2.set(some(4) as Some<number>)([some(1), some(2), some(3)]), [some(1), some(2), some(4)])
  })
})
