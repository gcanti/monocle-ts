import * as L from '../../src/Lens'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: string | boolean
}

//
// modify
//

// $ExpectType (s: A) => A
pipe(L.id<A>(), L.prop('c'), L.modify((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => A
pipe(L.id<A>(), L.prop('c'), L.modify(() => 'foo'))

//
// prop
//

// $ExpectError
pipe(L.id<A>(), L.prop('d'))

//
// props
//

// $ExpectError
pipe(L.id<A>(), L.props())
// $ExpectError
pipe(L.id<A>(), L.props('a'))

pipe(L.id<A>(), L.props('a', 'b')) // $ExpectType Lens<A, { a: string; b: number; }>

//
// component
//

// $ExpectError
pipe(L.id<{ 1: number }>(), L.component(1))
