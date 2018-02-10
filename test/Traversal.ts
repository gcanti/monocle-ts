import { Lens, fromTraversable } from '../src'
import * as assert from 'assert'
import { array } from 'fp-ts/lib/Array'

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
})
