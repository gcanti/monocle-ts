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

// console.log(JSON.stringify(employee2, null, 2))

const employee3 = nameLens.set('low street', employee)

// console.log(JSON.stringify(employee3, null, 2))

const numLens = streetLens.compose(new Lens<Street, number>(
  s => s.num,
  (a, s) => ({ ...s, num: a })
))

// console.log(JSON.stringify(numLens.set(42, employee), null, 2))

// generation
type PersonType = {
  name: string,
  age: number
};

const person: PersonType = { name: 'Giulio', age: 42 }

const age = Lens.fromProp<PersonType, 'age'>('age')

// console.log(age.set(43, person)) // => { name: 'Giulio', age: 43 }
