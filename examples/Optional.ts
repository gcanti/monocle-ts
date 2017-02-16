import { Lens, Optional } from '../src'
import { some, none } from 'fp-ts/lib/Option'
import { nameLens, employee } from './Lens'

const head = new Optional<string, string>(
  s => s.length > 0 ? some(s[0]) : none,
  (a, s) => a + s.substring(1)
)

// console.log(head.getOption('')) // => None
// console.log(head.getOption('hello')) // => Some('h')
// console.log(head.set('H', '')) // => 'H'
// console.log(head.set('H', 'hello')) // => 'Hello'

const optional = nameLens.asOptional().compose(head)

// console.log(JSON.stringify(optional.modify(s => s.toUpperCase(), employee), null, 2))

interface Person { name: string, surname: string | null | undefined }

const surname = Optional.fromProp<Person, 'surname', string>('surname')

const p: Person = { name: 'Giulio', surname: null }

// console.log(surname.getOption(p))
// console.log(surname.set('Canti', p))
