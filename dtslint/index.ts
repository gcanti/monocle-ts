import { Lens, Optional } from '../src'
import { Option } from 'fp-ts/lib/Option'

interface Person {
  name: string
  age: number
  rememberMe: boolean
  email: Option<string>
}

Lens.fromProp<Person, 'name'>('name') // $ExpectType Lens<Person, string>
// $ExpectError
Lens.fromProp<Person, 'foo'>(['foo'])
// $ExpectError
Lens.fromProp<Person, 'name'>(['foo'])

//
// fromProps
//

Lens.fromProps<Person>()(['name', 'age']) // $ExpectType Lens<Person, { name: string; age: number; }>
// $ExpectError
Lens.fromProps<Person>()(['foo'])

//
// fromOptionProps
//
Optional.fromOptionProp<Person>('email') // $ExpectType Optional<Person, string>
// $ExpectError
Optional.fromOptionProp<Person>()('name') // 'name' exists but is not of type Option<any>
// $ExpectError
Optional.fromOptionProp<Person>()('foo') // 'foo' is not a property of Person
