import * as O from 'fp-ts/lib/Option'
import { TraversableHomogeneousTuple } from '../src/internal'
import * as U from './util'

describe('internal', () => {
  describe('TraversableHomogeneousTuple', () => {
    it('traverse', () => {
      const traverse = (ta: readonly [number, number]) =>
        TraversableHomogeneousTuple.traverse(O.Applicative)(
          ta,
          (n: number): O.Option<number> => (n % 2 === 0 ? O.none : O.some(n))
        )
      U.deepStrictEqual(traverse([1, 2] as const), O.none)
      U.deepStrictEqual(traverse([1, 3] as const), O.some([1, 3] as const))
    })

    describe('sequence', () => {
      const sequence = TraversableHomogeneousTuple.sequence(O.Applicative)
      U.deepStrictEqual(sequence([O.some(1), O.some(3)]), O.some([1, 3] as const))
      U.deepStrictEqual(sequence([O.some(1), O.none]), O.none)
    })
  })
})
