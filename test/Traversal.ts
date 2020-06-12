import * as assert from 'assert'
import * as T from '../src/Traversal'
import * as A from 'fp-ts/lib/Array'
import * as Id from 'fp-ts/lib/Identity'

describe('Traversal', () => {
  it('fromTraversable', () => {
    const traversal = T.fromTraversable(A.array)<number>()
    assert.deepStrictEqual(traversal.modifyF(Id.identity)((n) => n * 2)([1, 2, 3]), [2, 4, 6])
  })
})
