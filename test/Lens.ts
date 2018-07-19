import { Lens } from '../src'
import * as assert from 'assert'

function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

describe('Lens', () => {
  it('fromPath', () => {
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

    const lens = Lens.fromPath<Employee, 'company', 'address', 'street', 'name'>([
      'company',
      'address',
      'street',
      'name'
    ])
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
    const newEmployee: Employee = lens.modify(capitalize)(employee)

    assert.strictEqual(newEmployee.company.address.street.name, 'High street')

    class Street {
      constructor(public num: number, public name: string) {}
    }

    class Address {
      constructor(public city: string, public street: Street) {}
    }

    class Company {
      constructor(public name: string, public address: Address) {}
    }

    class Employee {
      constructor(public name: string, public company: Company) {}
    }

    const classLens = Lens.fromPath<Employee, 'company', 'address', 'street', 'name'>([
      'company',
      'address',
      'street',
      'name'
    ])
    const employeeInstance = new Employee(
      'john',
      new Company('awesome inc', new Address('london', new Street(23, 'high street')))
    )
    const newEmployeeInstance = classLens.modify(capitalize)(employeeInstance)

    assert(newEmployeeInstance instanceof Employee)
    assert(newEmployeeInstance.company instanceof Company)
    assert(newEmployeeInstance.company.address instanceof Address)
    assert(newEmployeeInstance.company.address.street instanceof Street)
    assert.strictEqual(newEmployeeInstance.company.address.street.name, 'High street')
  })

  it('fromNullableProp', () => {
    interface Outer {
      inner?: Inner
    }

    interface Inner {
      value: number
      foo: string
    }

    const innerPropLens = Lens.fromNullableProp<Outer, Inner, 'inner'>('inner', { value: 0, foo: 'foo' })
    const valuePropLens = Lens.fromProp<Inner, 'value'>('value')
    const lens = innerPropLens.compose(valuePropLens)

    const newOuter1: Outer = lens.set(1)({})

    assert.deepEqual(newOuter1, { inner: { value: 1, foo: 'foo' } })
    assert.strictEqual(lens.get({}), 0)

    const newOuter2 = lens.set(1)({ inner: { value: 1, foo: 'bar' } })

    assert.deepEqual(newOuter2, { inner: { value: 1, foo: 'bar' } })
    assert.strictEqual(lens.get({ inner: { value: 1, foo: 'bar' } }), 1)

    class Outer {
      constructor(public inner?: Inner) {}
    }

    class Inner {
      constructor(public value: number, public foo: string) {}
    }

    const innerClassPropLens = Lens.fromNullableProp<Outer, Inner, 'inner'>('inner', new Inner(0, 'foo'))
    const valueClassPropLens = Lens.fromProp<Inner, 'value'>('value')
    const classLens = innerClassPropLens.compose(valueClassPropLens)

    const newOuterInstance1 = classLens.set(1)(new Outer())

    assert(newOuterInstance1 instanceof Outer)
    assert.deepEqual(newOuterInstance1, new Outer(new Inner(1, 'foo')))
    assert.strictEqual(classLens.get(new Outer()), 0)

    const newOuterInstance2 = classLens.set(1)(new Outer(new Inner(1, 'bar')))

    assert(newOuterInstance2 instanceof Outer)
    assert.deepEqual(newOuterInstance2, new Outer(new Inner(1, 'bar')))
    assert.strictEqual(classLens.get(new Outer(new Inner(1, 'bar'))), 1)
  })

  it('fromProps', () => {
    interface Person {
      name: string
      age: number
      rememberMe: boolean
    }

    const lens = Lens.fromProps<Person>()(['name', 'age'])
    const person: Person = { name: 'Giulio', age: 44, rememberMe: true }

    assert.deepEqual(lens.get(person), { name: 'Giulio', age: 44 })

    const newPerson = lens.set({ name: 'Guido', age: 47 })(person)

    assert.deepEqual(newPerson, { name: 'Guido', age: 47, rememberMe: true })

    class Person {
      constructor(public name: string, public age: number, public rememberMe: boolean) {}
    }

    const classLens = Lens.fromProps<Person>()(['name', 'age'])
    const personInstance = new Person('Giulio', 44, true)

    assert.deepEqual(classLens.get(personInstance), { name: 'Giulio', age: 44 })

    const newPersonInstance = classLens.set({ name: 'Guido', age: 47 })(personInstance)

    assert(newPersonInstance instanceof Person)
    assert.deepEqual(newPersonInstance, new Person('Guido', 47, true))
  })
})
