import * as T from '../../src/Traversal'
import { pipe } from 'fp-ts/function'

interface A {
  a: string
  b: number
  c: boolean
}

// $ExpectError
pipe(T.id<A>(), T.props())
// $ExpectError
pipe(T.id<A>(), T.props('a'))

pipe(T.id<A>(), T.props('a', 'b')) // $ExpectType Traversal<A, { a: string; b: number; }>
