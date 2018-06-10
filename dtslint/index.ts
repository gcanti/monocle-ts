import { Lens } from '../src'

interface Person {
  name: string
  age: number
  rememberMe: boolean
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
