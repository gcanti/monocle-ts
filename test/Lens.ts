import { Lens } from '../src'
import * as assert from 'assert'

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

interface Person {
  name: string
  age: number
  rememberMe: boolean
}

function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

describe('Lens', () => {
  it('fromPath', () => {
    const lens = Lens.fromPath<Employee, 'company', 'address', 'street', 'name'>([
      'company',
      'address',
      'street',
      'name'
    ])
    assert.strictEqual(lens.modify(capitalize)(employee).company.address.street.name, 'High street')
  })

  it('fromNullableProp', () => {
    interface Outer {
      inner?: Inner
    }

    interface Inner {
      value: number
      foo: string
    }

    const inner = Lens.fromNullableProp<Outer, Inner, 'inner'>('inner', { value: 0, foo: 'foo' })
    const value = Lens.fromProp<Inner, 'value'>('value')
    const lens = inner.compose(value)

    assert.deepEqual(lens.set(1)({}), { inner: { value: 1, foo: 'foo' } })
    assert.strictEqual(lens.get({}), 0)
    assert.deepEqual(lens.set(1)({ inner: { value: 1, foo: 'bar' } }), { inner: { value: 1, foo: 'bar' } })
    assert.strictEqual(lens.get({ inner: { value: 1, foo: 'bar' } }), 1)
  })

  it('fromProps', () => {
    const person: Person = { name: 'Giulio', age: 44, rememberMe: true }
    const lens = Lens.fromProps<Person>()(['name', 'age'])
    assert.deepEqual(lens.get(person), { name: 'Giulio', age: 44 })
    assert.deepEqual(lens.set({ name: 'Guido', age: 47 })(person), { name: 'Guido', age: 47, rememberMe: true })
  })
})
