import { Lens, fromTraversable } from '../src'
import * as assert from 'assert'
import { array } from 'fp-ts/lib/Array'
import { Option, isSome, some, Some } from 'fp-ts/lib/Option'

describe('Traversal', () => {
  it('fromTraversable', () => {
    interface Tweet {
      text: string
    }

    interface Tweets {
      tweets: Tweet[]
    }

    const tweetsLens = Lens.fromProp<Tweets, 'tweets'>('tweets')
    const tweetTextLens = Lens.fromProp<Tweet, 'text'>('text')
    const tweetTraversal = fromTraversable(array)<Tweet>()
    const composedTraversal = tweetsLens.composeTraversal(tweetTraversal).composeLens(tweetTextLens)

    const tweet1: Tweet = { text: 'hello world' }
    const tweet2: Tweet = { text: 'foobar' }
    const model: Tweets = { tweets: [tweet1, tweet2] }

    const newModel = composedTraversal.modify(text =>
      text
        .split('')
        .reverse()
        .join('')
    )(model)
    assert.deepEqual(newModel, { tweets: [{ text: 'dlrow olleh' }, { text: 'raboof' }] })
  })

  it('set', () => {
    const traversal = fromTraversable(array)<string>()
    assert.deepEqual(traversal.set('a')([]), [])
    assert.deepEqual(traversal.set('a')(['b', 'c']), ['a', 'a'])
  })

  it('filter', () => {
    const traversal1 = fromTraversable(array)<string>().filter(s => s.length > 2)
    assert.deepEqual(traversal1.set('a')([]), [])
    assert.deepEqual(traversal1.set('a')(['b', 'c']), ['b', 'c'])
    assert.deepEqual(traversal1.set('a')(['b', 'foo', 'c']), ['b', 'a', 'c'])

    const traversal2 = fromTraversable(array)<Option<number>>()
      .filter(isSome)
      .filter(o => o.value > 2)
    assert.deepEqual(traversal2.set(new Some(2))([]), [])
    assert.deepEqual(traversal2.set(new Some(4))([some(1), some(2), some(3)]), [some(1), some(2), some(4)])
  })
})
