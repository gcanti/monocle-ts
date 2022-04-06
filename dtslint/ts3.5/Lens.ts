import * as L from '../../src/Lens'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: string | boolean
}

declare const lensC: L.Lens<A, A['c']>

//
// modify
//

// $ExpectType (s: A) => A
pipe(lensC, L.modify((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => A
pipe(lensC, L.modify<string | boolean>(() => 'foo'))

// $ExpectType (s: A) => A
pipe(lensC, L.modify(() => 'foo'))

//
// prop
//

// $ExpectError
pipe(L.id<A>(), L.prop('d'))

//
// props
//

// $ExpectError
pipe(L.id<A>(), L.pick())
// $ExpectError
pipe(L.id<A>(), L.pick('a'))

pipe(L.id<A>(), L.pick('a', 'b')) // $ExpectType Lens<A, { a: string; b: number; }>

//
// component
//

// $ExpectError
pipe(L.id<{ 1: number }>(), L.component(1))
