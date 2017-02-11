import { Lens } from '../src'

export interface Street { num: number, name: string }
export interface Address { city: string, street: Street }
export interface Company { name: string, address: Address }
export interface Employee { name: string, company: Company }

export const employee: Employee = {
  name: "john",
  company: {
    name: "awesome inc",
    address: {
      city: "london",
      street: {
        num: 23,
        name: "high street"
      }
    }
  }
}

const company = new Lens<Employee, Company>(s => s.company, (a, s) => ({ ...s, company: a }))

// console.log(JSON.stringify(company.get(employee), null, 2))

const address = new Lens<Company, Address>(s => s.address, (a, s) => ({ ...s, address: a }))
const street = new Lens<Address, Street>(s => s.street, (a, s) => ({ ...s, street: a }))
const name = new Lens<Street, string>(s => s.name, (a, s) => ({ ...s, name: a }))

// composition
const streetLens = company.compose(address).compose(street)
export const nameLens = streetLens.compose(name)

// console.log(JSON.stringify(nameLens.get(employee), null, 2))

const employee2 = nameLens.modify(a => a.toUpperCase(), employee)

console.log(JSON.stringify(employee2, null, 2))

const employee3 = nameLens.set('low street', employee)

// console.log(JSON.stringify(employee3, null, 2))

const numLens = streetLens.compose(new Lens<Street, number>(
  s => s.num,
  (a, s) => ({ ...s, num: a })
))

// console.log(JSON.stringify(numLens.set(42, employee), null, 2))

// generation

import * as t from 'io-ts'
// import { Lens } from 'fp-ts/lib/monocle'

const Person = t.object({
  name: t.string,
  age: t.number
})

type PersonType = t.TypeOf<typeof Person>;

const person: PersonType = { name: 'Giulio', age: 42 }

// generate a lens from a type and a prop
function createLens<T, P extends keyof T>(prop: P): Lens<T, T[P]> {
  return new Lens<T, T[P]>(
    s => s[prop],
    (a, s) => Object.assign({}, s, { [prop as string]: a })
  )
}

const age = createLens<PersonType, 'age'>('age')

// console.log(age.set(43, person)) // => { name: 'Giulio', age: 43 }

function createLens2<T extends t.ObjectType<any>, K extends keyof T['props']>(type: T, prop: K): Lens<t.TypeOf<T>, t.TypeOf<T['props'][K]>> {
  if (type.props[prop] instanceof t.MaybeType) {
    throw new Error('cannot create a lens for an optional type')
  }
  return createLens<t.TypeOf<T>, typeof prop>(prop)
}

const age2 = createLens2(Person, 'age')

// generate all lenses from runtime type props
function createAllLenses<P extends t.Props, T extends t.ObjectType<P>>(type: T): { [K in keyof T['props']]: Lens<t.TypeOf<T>, t.TypeOf<T['props'][K]>> } {
  const r: any = {}
  for (const k in type.props) {
    r[k] = createLens<t.TypeOf<T>, typeof k>(k)
  }
  return r
}

const lenses = createAllLenses(Person)

// console.log(lenses.name.set('Guido', person)) // => { name: 'Guido', age: 42 }
// console.log(lenses.age.set(43, person)) // => { name: 'Giulio', age: 43 }

