import { Lens } from '../src'
import * as assert from 'assert'
import { identity } from 'fp-ts/lib/function'

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

const person: Person = { name: 'giulio', age: 44, rememberMe: true }

function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

describe('Lens', () => {
  it('fromProp', () => {
    const name2 = Lens.fromProp<Person>()('name')
    assert.strictEqual(name2.get(person), 'giulio')
    assert.strictEqual(name2.modify(capitalize)(person).name, 'Giulio')
    assert.strictEqual(name2.set('giulio')(person), person)
    assert.strictEqual(name2.modify(identity)(person), person)
  })

  it('fromPath', () => {
    const lens = Lens.fromPath<Employee>()(['company', 'address', 'street', 'name'])
    assert.strictEqual(lens.modify(capitalize)(employee).company.address.street.name, 'High street')
    assert.strictEqual(lens.set('high street')(employee), employee)
    assert.strictEqual(lens.modify(identity)(employee), employee)
  })

  it('fromNullableProp', () => {
    interface Outer {
      inner?: Inner
    }
    const outer1 = { inner: { value: 1, foo: 'a' } }

    interface Inner {
      value: number
      foo: string
    }

    const value = Lens.fromProp<Inner>()('value')
    const inner = Lens.fromNullableProp<Outer>()('inner', { value: 0, foo: 'foo' })
    const lens = inner.compose(value)
    assert.deepStrictEqual(lens.set(1)({}), { inner: { value: 1, foo: 'foo' } })
    assert.strictEqual(lens.get({}), 0)
    assert.deepStrictEqual(lens.set(1)({ inner: { value: 1, foo: 'bar' } }), { inner: { value: 1, foo: 'bar' } })
    assert.strictEqual(lens.get({ inner: { value: 1, foo: 'bar' } }), 1)
    assert.strictEqual(lens.set(1)(outer1), outer1)
    assert.strictEqual(lens.modify(identity)(outer1), outer1)
  })

  it('fromProps', () => {
    const lens = Lens.fromProps<Person>()(['name', 'age'])
    assert.deepStrictEqual(lens.get(person), { name: 'giulio', age: 44 })
    assert.deepStrictEqual(lens.set({ name: 'Guido', age: 47 })(person), { name: 'Guido', age: 47, rememberMe: true })
    assert.strictEqual(lens.set({ age: 44, name: 'giulio' })(person), person)
    assert.strictEqual(lens.modify(identity)(person), person)
  })

  it('compose', () => {
    const street = Lens.fromProp<Address>()('street')
    const name = Lens.fromProp<Street>()('name')
    const composition1 = street.compose(name)
    const composition2 = street.composeLens(name)
    const address: Address = {
      city: 'city',
      street: {
        name: 'name',
        num: 1
      }
    }
    const expected = {
      city: 'city',
      street: {
        name: 'name2',
        num: 1
      }
    }
    assert.strictEqual(composition1.get(address), 'name')
    assert.deepStrictEqual(composition1.set('name2')(address), expected)
    assert.strictEqual(composition1.set('name')(address), address)
    assert.strictEqual(composition1.modify(identity)(address), address)

    assert.strictEqual(composition2.get(address), composition1.get(address))
    assert.deepStrictEqual(composition2.set('name2')(address), composition1.set('name2')(address))
    assert.strictEqual(composition2.set('name')(address), address)
    assert.strictEqual(composition2.modify(identity)(address), address)
  })
})
