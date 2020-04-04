interface Street {
  num: number
  name: string
}
interface Address {
  city: string
  street: Street
}
interface Company {
  name: string
  address: Address
}
interface Employee {
  name: string
  company: Company
}

const employee: Employee = {
  name: 'john',
  company: {
    name: 'awesome inc',
    address: {
      city: 'london',
      street: {
        num: 23,
        name: 'high street'
      }
    }
  }
}

function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

const employee2 = {
  ...employee,
  company: {
    ...employee.company,
    address: {
      ...employee.company.address,
      street: {
        ...employee.company.address.street,
        name: capitalize(employee.company.address.street.name)
      }
    }
  }
}

console.log(JSON.stringify(employee2, null, 2))

import { Lens, Optional } from '../src'

const company = Lens.fromProp<Employee, 'company'>('company')
const address = Lens.fromProp<Company, 'address'>('address')
const street = Lens.fromProp<Address, 'street'>('street')
const name = Lens.fromProp<Street, 'name'>('name')

import { some, none } from 'fp-ts/lib/Option'

const firstLetter = new Optional<string, string>(
  (s) => (s.length > 0 ? some(s[0]) : none),
  (a) => (s) => a + s.substring(1)
)

console.log(
  JSON.stringify(
    company
      .compose(address)
      .compose(street)
      .compose(name)
      .asOptional()
      .compose(firstLetter)
      .modify((s) => s.toUpperCase())(employee),
    null,
    2
  )
)
