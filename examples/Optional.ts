import { Lens, Optional, Prism } from '../src'
import { Option, some, none } from 'fp-ts/lib/Option'
import { nameLens, employee } from './Lens'

const head = new Optional<string, string>(
  s => (s.length > 0 ? some(s[0]) : none),
  a => s => (s.length > 0 ? a + s.substring(1) : '')
)

console.log(head.getOption('')) // => None
console.log(head.getOption('hello')) // => Some('h')
console.log(head.set('H')('')) // => ''
console.log(head.set('H')('hello')) // => 'Hello'

const optional = nameLens.asOptional().compose(head)

console.log(JSON.stringify(optional.modify(s => s.toUpperCase())(employee), null, 2))

interface Person {
  name: string
  surname: Option<string>
}

const surname = Lens.fromProp<Person, 'surname'>('surname').composePrism(Prism.some<string>())

const p: Person = { name: 'Giulio', surname: none }

console.log(surname.getOption(p)) // => None
console.log(surname.set('Canti')(p)) // => { name: 'Giulio', surname: Some("Canti") }
