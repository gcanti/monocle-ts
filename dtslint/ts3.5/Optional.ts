import * as O from '../../src/Optional'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: string | boolean
}

declare const optionalC: O.Optional<A, A['c']>

//
// modifyOption
//

// $ExpectType (s: A) => Option<A>
pipe(optionalC, O.modifyOption((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => Option<A>
pipe(optionalC, O.modifyOption<string | boolean>(() => 'foo'))

// $ExpectType (s: A) => Option<A>
pipe(optionalC, O.modifyOption(() => 'foo'))

//
// modify
//

// $ExpectType (s: A) => A
pipe(optionalC, O.modify((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => A
pipe(optionalC, O.modify<string | boolean>(() => 'foo'))

// $ExpectType (s: A) => A
pipe(optionalC, O.modify(() => 'foo'))

// $ExpectError
pipe(O.id<A>(), O.props())
// $ExpectError
pipe(O.id<A>(), O.props('a'))

pipe(O.id<A>(), O.props('a', 'b')) // $ExpectType Optional<A, { a: string; b: number; }>
