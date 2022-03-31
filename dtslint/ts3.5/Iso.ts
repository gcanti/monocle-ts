import * as _ from '../../src/Iso'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: string | boolean
}

declare const isoC: _.Iso<A, A['c']>

//
// modify
//

// $ExpectType (s: A) => A
pipe(isoC, _.modify((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => A
pipe(isoC, _.modify<string | boolean>(() => 'foo'))

// $ExpectType (s: A) => A
pipe(isoC, _.modify(() => 'foo'))
