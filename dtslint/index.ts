import { Lens, Optional } from '../src'
import { Option } from 'fp-ts/lib/Option'

interface Person {
  name: string
  age: number
  rememberMe: boolean
  email: Option<string>
}

type FromPropGood = { [K in 'a' | 'b']: number }

interface FromNullablePropGood {
  a?: string
}

//
// Lens.fromProp
//

Lens.fromProp<Person, 'name'>('name') // $ExpectType Lens<Person, string>
Lens.fromProp<FromPropGood>()('a') // $ExpectType Lens<FromPropGood, number>

// $ExpectError
Lens.fromProp<Person, 'foo'>(['foo'])
// $ExpectError
Lens.fromProp<Person, 'name'>(['foo'])
// $ExpectError
Lens.fromProp<string[]>()(1)
// $ExpectError
Lens.fromProp<string[], 1>(1)
// $ExpectError
Lens.fromProp<[string, number]>()('1')
// $ExpectError
Lens.fromProp<[string, number], '1'>('1')
// $ExpectError
Lens.fromProp<[string, number]>()(1)
// $ExpectError
Lens.fromProp<[string, number], 1>(1)
// $ExpectError
Lens.fromProp<Record<string, number>>()('foo')
// $ExpectError
Lens.fromProp<Record<number, number>>()(1)
// $ExpectError
Lens.fromProp<Record<string, number>, 'foo'>('foo')
// $ExpectError
Lens.fromProp<{ [key: string]: number }>()('foo')
// $ExpectError
Lens.fromProp<{ [key: string]: number }, 'foo'>('foo')

//
// Lens.fromProps
//

Lens.fromProps<Person>()(['name', 'age']) // $ExpectType Lens<Person, { name: string; age: number; }>
Lens.fromProps<FromPropGood>()(['a', 'b']) // $ExpectType Lens<FromPropGood, { a: number; b: number; }>

// $ExpectError
Lens.fromProps<Person>()(['foo'])
// $ExpectError
Lens.fromProps<string[]>()([0, 1])
// $ExpectError
Lens.fromProps<[string, number]>()([0, 1])
// $ExpectError
Lens.fromProps<Record<string, number>>()(['foo'])
// $ExpectError
Lens.fromProps<{ [key: string]: number }>()(['foo'])

//
// Lens.fromPath
//

interface FromPathGood {
  a: {
    b: {
      c: {
        d: number
      }
    }
  }
}

interface FromPathBad {
  a: {
    b: {
      c: {
        [key: string]: number
      }
      d: Array<number>
    }
  }
}

Lens.fromPath<FromPathGood>()(['a', 'b', 'c', 'd']) // $ExpectType Lens<FromPathGood, number>
Lens.fromPath<FromPathGood, 'a', 'b', 'c', 'd'>(['a', 'b', 'c', 'd'])

// $ExpectError
Lens.fromPath<FromPathBad>()(['a', 'b', 'c', 'foo'])
// $ExpectError
Lens.fromPath<FromPathBad>()(['a', 'b', 'd', 1])
// $ExpectError
Lens.fromPath<FromPathBad, 'a', 'b', 'c', 'foo'>(['a', 'b', 'c', 'foo'])
// $ExpectError
Lens.fromPath<FromPathBad, 'a', 'b', 'd', 1>(['a', 'b', 'd', 1])

//
// Lens.fromNullableProp
//

Lens.fromNullableProp<FromNullablePropGood, string, 'a'>('a', 'foo') // $ExpectType Lens<FromNullablePropGood, string>
Lens.fromNullableProp<FromNullablePropGood>()('a', 'foo') // $ExpectType Lens<FromNullablePropGood, string>

// $ExpectError
Lens.fromNullableProp<Array<string>, string, 1>(1, 'foo')
// $ExpectError
Lens.fromNullableProp<Array<string>>()(1, 'foo')
// $ExpectError
Lens.fromNullableProp<[string, number], string, 0>(0, 'foo')
// $ExpectError
Lens.fromNullableProp<[string, number]>()(0, 'foo')
// $ExpectError
Lens.fromNullableProp<Record<string, number>, number, 'foo'>('foo', 1)
// $ExpectError
Lens.fromNullableProp<Record<string, number>>()('foo', 1)
// $ExpectError
Lens.fromNullableProp<{ [key: string]: number }, number, 'foo'>('foo', 1)
// $ExpectError
Lens.fromNullableProp<{ [key: string]: number }>()('foo', 1)

//
// Optional.fromNullableProp
//

Optional.fromNullableProp<FromNullablePropGood>()('a') // $ExpectType Optional<FromNullablePropGood, string>
Optional.fromNullableProp<FromNullablePropGood, string, 'a'>('a') // $ExpectType Optional<FromNullablePropGood, string>

// $ExpectError
Optional.fromNullableProp<Array<string>>()(1)
// $ExpectError
Optional.fromNullableProp<Array<string>, string, 1>(1)
// $ExpectError
Optional.fromNullableProp<[string, number]>()(1)
// $ExpectError
Optional.fromNullableProp<[string, number], number, 1>(1)
// $ExpectError
Optional.fromNullableProp<Record<string, number>>()('foo')
// $ExpectError
Optional.fromNullableProp<Record<string, number>, number, 'foo'>('foo')
// $ExpectError
Optional.fromNullableProp<{ [key: string]: number }>()('foo')
// $ExpectError
Optional.fromNullableProp<{ [key: string]: number }, number, 'foo'>('foo')

//
// Optional.fromOptionProp
//

Optional.fromOptionProp<Person>('email') // $ExpectType Optional<Person, string>
// $ExpectError
Optional.fromOptionProp<Person>()('name') // 'name' exists but is not of type Option<any>
// $ExpectError
Optional.fromOptionProp<Person>()('foo') // 'foo' is not a property of Person

// $ExpectError
Optional.fromOptionProp<Array<string>>()(1)
// $ExpectError
Optional.fromOptionProp<Array<string>>(1)
// $ExpectError
Optional.fromOptionProp<[string, number]>()(1)
// $ExpectError
Optional.fromOptionProp<[string, number]>(1)
// $ExpectError
Optional.fromOptionProp<Record<string, Option<number>>>()('foo')
// $ExpectError
Optional.fromOptionProp<Record<string, Option<number>>>('foo')
// $ExpectError
Optional.fromOptionProp<{ [key: string]: Option<number> }>()('foo')
// $ExpectError
Optional.fromOptionProp<{ [key: string]: Option<number> }>('foo')
