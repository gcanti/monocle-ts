[![build status](https://img.shields.io/travis/gcanti/monocle-ts/master.svg?style=flat-square)](https://travis-ci.org/gcanti/monocle-ts)
[![dependency status](https://img.shields.io/david/gcanti/monocle-ts.svg?style=flat-square)](https://david-dm.org/gcanti/monocle-ts)
![npm downloads](https://img.shields.io/npm/dm/monocle-ts.svg)

# Motivation

(Adapted from [monocle site](http://julien-truffaut.github.io/Monocle/))

Modifying immutable nested object in JavaScript is verbose which makes code difficult to understand and reason about.

Let's have a look at some examples:

```ts
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
```

Let’s say we have an employee and we need to upper case the first character of his company street name. Here is how we
could write it in vanilla JavaScript

```ts
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

const capitalize = (s: string): string => s.substring(0, 1).toUpperCase() + s.substring(1)

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
```

As we can see copy is not convenient to update nested objects because we need to repeat ourselves. Let's see what could
we do with `monocle-ts`

```ts
import { Lens } from 'monocle-ts'

const company = Lens.fromProp<Employee>()('company')
const address = Lens.fromProp<Company>()('address')
const street = Lens.fromProp<Address>()('street')
const name = Lens.fromProp<Street>()('name')

company
  .compose(address)
  .compose(street)
  .compose(name)
```

`compose` takes two `Lenses`, one from `A` to `B` and another one from `B` to `C` and creates a third `Lens` from `A` to
`C`. Therefore, after composing `company`, `address`, `street` and `name`, we obtain a `Lens` from `Employee` to
`string` (the street name). Now we can use this `Lens` issued from the composition to modify the street name using the
function `capitalize`

```ts
company
  .compose(address)
  .compose(street)
  .compose(name)
  .modify(capitalize)(employee)
```

You can use the `fromPath` API to avoid some boilerplate

```ts
import { Lens } from 'monocle-ts'

const name = Lens.fromPath<Employee>()(['company', 'address', 'street', 'name'])

name.modify(capitalize)(employee)
```

Here `modify` lift a function `string => string` to a function `Employee => Employee`. It works but it would be clearer
if we could zoom into the first character of a `string` with a `Lens`. However, we cannot write such a `Lens` because
`Lenses` require the field they are directed at to be _mandatory_. In our case the first character of a `string` is
optional as a `string` can be empty. So we need another abstraction that would be a sort of partial Lens, in
`monocle-ts` it is called an `Optional`.

```ts
import { Optional } from 'monocle-ts'
import { some, none } from 'fp-ts/lib/Option'

const firstLetter = new Optional<string, string>(s => (s.length > 0 ? some(s[0]) : none), a => s => a + s.substring(1))

company
  .compose(address)
  .compose(street)
  .compose(name)
  .asOptional()
  .compose(firstLetter)
  .modify(s => s.toUpperCase())(employee)
```

Similarly to `compose` for lenses, `compose` for optionals takes two `Optionals`, one from `A` to `B` and another from
`B` to `C` and creates a third `Optional` from `A` to `C`. All `Lenses` can be seen as `Optionals` where the optional
element to zoom into is always present, hence composing an `Optional` and a `Lens` always produces an `Optional`.

# TypeScript compatibility

The stable version is tested against TypeScript 3.2.2, but should run with TypeScript 2.8.0+ too

**Note**. If you are running `< typescript@3.0.1` you have to polyfill `unknown`.

You can use [unknown-ts](https://github.com/gcanti/unknown-ts) as a polyfill.

# Documentation

- [API Reference](https://gcanti.github.io/monocle-ts/)
