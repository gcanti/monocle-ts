import { Lens } from '../src'
import * as assert from 'assert'

interface Street { num: number, name: string }
interface Address { city: string, street: Street }
interface Company { name: string, address: Address }
interface Employee { name: string, company: Company }

const employee: Employee = {
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

function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

describe('Lens', () => {

  it('fromPath', () => {
    const lens = Lens.fromPath<Employee, 'company', 'address', 'street', 'name'>(['company', 'address', 'street', 'name'])
    assert.strictEqual(lens.modify(capitalize, employee).company.address.street.name, 'High street')
  })

})
