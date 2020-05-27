import { Lens, Optional, fromFoldable } from '../../src'
import { Option } from 'fp-ts/lib/Option'
import { array } from 'fp-ts/lib/Array'

interface Person {
  name: string
  age: number
  rememberMe: boolean
  email: Option<string>
  bio?: string
  a: {
    b: {
      c: {
        d: number
      }
    }
  }
}

type ConstrainedRecord = { [K in 'a' | 'b']: number }

//
// OptionPropertyNames
//

type OptionPropertyNames<S> = { [K in keyof S]-?: S[K] extends Option<any> ? K : never }[keyof S]

type Options = OptionPropertyNames<Person> // $ExpectType "email"

//
// Lens.fromProp
//

Lens.fromProp<Person>()('name') // $ExpectType Lens<Person, string>
Lens.fromProp<ConstrainedRecord>()('a') // $ExpectType Lens<ConstrainedRecord, number>

// $ExpectError
Lens.fromProp<Person>()(['foo'])

//
// Lens.fromProps
//

Lens.fromProps<Person>()(['name', 'age']) // $ExpectType Lens<Person, { name: string; age: number; }>
const getLensFromProps = <T extends Person>(): Lens<T, { name: string }> => Lens.fromProps<T>()(['name'])
Lens.fromProps<ConstrainedRecord>()(['a', 'b']) // $ExpectType Lens<ConstrainedRecord, { a: number; b: number; }>

// $ExpectError
Lens.fromProps<Person>()(['foo'])

//
// Lens.fromPath
//

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

Lens.fromPath<Person>()(['a', 'b', 'c', 'd']) // $ExpectType Lens<Person, number>
const getLensFromPath = <T extends Person>(): Lens<T, number> => Lens.fromPath<T>()(['a', 'b', 'c', 'd'])

//
// Lens.fromNullableProp
//

Lens.fromNullableProp<Person>()('bio', 'foo') // $ExpectType Lens<Person, string>
const getLensFromNullableProp = <T extends Person>(): Lens<T, NonNullable<T['bio']>> =>
  Lens.fromNullableProp<T>()('bio', 'foo')

//
// Optional.fromNullableProp
//

Optional.fromNullableProp<Person>()('bio') // $ExpectType Optional<Person, string>
const getOptionalFromNullableProp = <T extends Person>(): Optional<T, NonNullable<T['bio']>> =>
  Optional.fromNullableProp<T>()('bio')

//
// Optional.fromPath
//

Optional.fromPath<Person>()(['bio']) // $ExpectType Optional<Person, string>

//
// Optional.fromOptionProp
//

Optional.fromOptionProp<Person>()('email') // $ExpectType Optional<Person, string>
// const getOptionalFromOptionProp = <T extends Person>(): Optional<T, string> => Optional.fromOptionProp<T>('email')

// $ExpectError
Optional.fromOptionProp<Person>(undefined)
// $ExpectError
Optional.fromOptionProp<Person>()(undefined)
// $ExpectError
Optional.fromOptionProp<Person>()('name') // 'name' exists but is not of type Option<any>
// $ExpectError
Optional.fromOptionProp<Person>('name')
// $ExpectError
Optional.fromOptionProp<Person>()('foo') // 'foo' is not a property of Person
// $ExpectError
Optional.fromOptionProp<Person>('foo')

interface Phone {
  number: string
}
interface Employment {
  phone: Option<Phone>
}

Optional.fromOptionProp<Employment>()('phone') // $ExpectType Optional<Employment, Phone>
// $ExpectError
Optional.fromOptionProp<Employment>()('foo')

interface A {
  type: 'A'
}
interface B {
  type: 'B'
}

const fold = fromFoldable(array)<A | B>()
const isB = (x: A | B): x is B => x.type === 'B'
const s: Array<A | B> = []

// Fold find method
fold.find(isB)(s) // $ExpectType Option<B>
