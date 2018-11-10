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
import { Lens, Optional } from 'monocle-ts'

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

Here `modify` lift a function `string => string` to a function `Employee => Employee`. It works but it would be clearer
if we could zoom into the first character of a `string` with a `Lens`. However, we cannot write such a `Lens` because
`Lenses` require the field they are directed at to be _mandatory_. In our case the first character of a `string` is
optional as a `string` can be empty. So we need another abstraction that would be a sort of partial Lens, in
`monocle-ts` it is called an `Optional`.

```ts
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

The stable version is tested against TypeScript 3.1.6, but should run with TypeScript 2.8.0+ too

# API

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Iso](#iso)
  - [Methods](#methods)
    - [unwrap](#unwrap)
    - [to](#to)
    - [wrap](#wrap)
    - [from](#from)
    - [reverse](#reverse)
    - [modify](#modify)
    - [asLens](#aslens)
    - [asPrism](#asprism)
    - [asOptional](#asoptional)
    - [asTraversal](#astraversal)
    - [asFold](#asfold)
    - [asGetter](#asgetter)
    - [asSetter](#assetter)
    - [compose](#compose)
    - [composeLens](#composelens)
    - [composePrism](#composeprism)
    - [composeOptional](#composeoptional)
    - [composeTraversal](#composetraversal)
    - [composeFold](#composefold)
    - [composeGetter](#composegetter)
    - [composeSetter](#composesetter)
- [Lens](#lens)
  - [fromPath](#frompath)
  - [fromProp](#fromprop)
  - [fromProps](#fromprops)
  - [fromNullableProp](#fromnullableprop)
  - [Methods](#methods-1)
    - [modify](#modify-1)
    - [asOptional](#asoptional-1)
    - [asTraversal](#astraversal-1)
    - [asSetter](#assetter-1)
    - [asGetter](#asgetter-1)
    - [asFold](#asfold-1)
    - [compose](#compose-1)
    - [composeGetter](#composegetter-1)
    - [composeFold](#composefold-1)
    - [composeOptional](#composeoptional-1)
    - [composeTraversal](#composetraversal-1)
    - [composeSetter](#composesetter-1)
    - [composeIso](#composeiso)
    - [composePrism](#composeprism-1)
- [Prism](#prism)
  - [fromPredicate](#frompredicate)
  - [some](#some)
  - [Methods](#methods-2)
    - [modify](#modify-2)
    - [modifyOption](#modifyoption)
    - [set](#set)
    - [asOptional](#asoptional-2)
    - [asTraversal](#astraversal-2)
    - [asSetter](#assetter-2)
    - [asFold](#asfold-2)
    - [compose](#compose-2)
    - [composeOptional](#composeoptional-2)
    - [composeTraversal](#composetraversal-2)
    - [composeFold](#composefold-2)
    - [composeSetter](#composesetter-2)
    - [composeIso](#composeiso-1)
    - [composeLens](#composelens-1)
    - [composeGetter](#composegetter-2)
- [Optional](#optional)
  - [fromNullableProp](#fromnullableprop-1)
  - [fromOptionProp](#fromoptionprop)
  - [Methods](#methods-3)
    - [modify](#modify-3)
    - [modifyOption](#modifyoption-1)
    - [asTraversal](#astraversal-3)
    - [asFold](#asfold-3)
    - [asSetter](#assetter-3)
    - [compose](#compose-3)
    - [composeTraversal](#composetraversal-3)
    - [composeFold](#composefold-3)
    - [composeSetter](#composesetter-3)
    - [composeLens](#composelens-2)
    - [composePrism](#composeprism-2)
    - [composeIso](#composeiso-2)
    - [composeGetter](#composegetter-3)
- [Traversal](#traversal)
  - [Methods](#methods-4)
    - [modify](#modify-4)
    - [set](#set-1)
    - [asFold](#asfold-4)
    - [asSetter](#assetter-4)
    - [compose](#compose-4)
    - [composeFold](#composefold-4)
    - [composeSetter](#composesetter-4)
    - [composeOptional](#composeoptional-3)
    - [composeLens](#composelens-3)
    - [composePrism](#composeprism-3)
    - [composeIso](#composeiso-3)
    - [composeGetter](#composegetter-4)
- [Getter](#getter)
  - [Methods](#methods-5)
    - [asFold](#asfold-5)
    - [compose](#compose-5)
    - [composeFold](#composefold-5)
    - [composeLens](#composelens-4)
    - [composeIso](#composeiso-4)
    - [composeTraversal](#composetraversal-4)
    - [composeOptional](#composeoptional-4)
    - [composePrism](#composeprism-4)
- [Fold](#fold)
  - [Methods](#methods-6)
    - [compose](#compose-6)
    - [composeGetter](#composegetter-5)
    - [composeTraversal](#composetraversal-5)
    - [composeOptional](#composeoptional-5)
    - [composeLens](#composelens-5)
    - [composePrism](#composeprism-5)
    - [composeIso](#composeiso-5)
    - [find](#find)
    - [headOption](#headoption)
    - [getAll](#getall)
    - [exist](#exist)
    - [all](#all)
- [Setter](#setter)
  - [Methods](#methods-7)
    - [set](#set-2)
    - [compose](#compose-7)
    - [composeTraversal](#composetraversal-6)
    - [composeOptional](#composeoptional-6)
    - [composeLens](#composelens-6)
    - [composePrism](#composeprism-6)
    - [composeIso](#composeiso-6)
- [fromTraversable](#fromtraversable)
- [fromFoldable](#fromfoldable)
- [At](#at)
  - [Methods](#methods-8)
    - [fromIso](#fromiso)
  - [Instances](#instances)
    - [Set](#set)
      - [atSet](#atset)
    - [StrMap](#strmap)
      - [atStrMap](#atstrmap)
- [Index](#index)
  - [fromAt](#fromat)
  - [Methods](#methods-9)
    - [fromIso](#fromiso-1)
  - [Instances](#instances-1)
    - [Array](#array)
      - [indexArray](#indexarray)
    - [StrMap](#strmap-1)
      - [indexStrMap](#indexstrmap)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Iso

```ts
class Iso<S, A> {
  constructor(readonly get: (s: S) => A, readonly reverseGet: (a: A) => S)
}
```

## Methods

### unwrap

```ts
;(s: S) => A
```

Alias of `get`

### to

```ts
;(s: S) => A
```

Alias of `get`

### wrap

```ts
;(a: A) => S
```

Alias of `reverseGet`

### from

```ts
;(a: A) => S
```

Alias of `reverseGet`

### reverse

```ts
(): Iso<A, S>
```

reverse the `Iso`: the source becomes the target and the target becomes the source

### modify

```ts
(f: (a: A) => A): (s: S) => S
```

### asLens

```ts
(): Lens<S, A>
```

view an Iso as a Lens

### asPrism

```ts
(): Prism<S, A>
```

view an Iso as a Prism

### asOptional

```ts
(): Optional<S, A>
```

view an Iso as a Optional

### asTraversal

```ts
(): Traversal<S, A>
```

view an Iso as a Traversal

### asFold

```ts
(): Fold<S, A>
```

view an Iso as a Fold

### asGetter

```ts
(): Getter<S, A>
```

view an Iso as a Getter

### asSetter

```ts
(): Setter<S, A>
```

view an Iso as a Setter

### compose

```ts
<B>(ab: Iso<A, B>): Iso<S, B>
```

compose an Iso with an Iso

### composeLens

```ts
<B>(ab: Lens<A, B>): Lens<S, B>
```

compose an Iso with a Lens

### composePrism

```ts
<B>(ab: Prism<A, B>): Prism<S, B>
```

compose an Iso with a Prism

### composeOptional

```ts
<B>(ab: Optional<A, B>): Optional<S, B>
```

compose an Iso with an Optional

### composeTraversal

```ts
<B>(ab: Traversal<A, B>): Traversal<S, B>
```

compose an Iso with a Traversal

### composeFold

```ts
<B>(ab: Fold<A, B>): Fold<S, B>
```

compose an Iso with a Fold

### composeGetter

```ts
<B>(ab: Getter<A, B>): Getter<S, B>
```

compose an Iso with a Getter

### composeSetter

```ts
<B>(ab: Setter<A, B>): Setter<S, B>
```

compose an Iso with a Setter

# Lens

```ts
class Lens<S, A> {
  constructor(readonly get: (s: S) => A, readonly set: (a: A) => (s: S) => S)
}
```

## fromPath

```ts
<S>(): <K1 extends keyof S>(path: [K1]) => Lens<S, S[K1]> // other 4 overloadings
// or (deprecated)
<S, K1 extends keyof S>(path: [K1]): Lens<S, S[K1]> // other 4 overloadings
```

Example

```ts
type Person = {
  name: string
  age: number
  address: {
    city: string
  }
}

const city = Lens.fromPath<Person>()(['address', 'city'])

const person: Person = { name: 'Giulio', age: 43, address: { city: 'Milan' } }

console.log(city.get(person)) // Milan
console.log(city.set('London')(person)) // { name: 'Giulio', age: 43, address: { city: 'London' } }
```

## fromProp

```ts
<S>(): <P extends keyof S>(prop: P) => Lens<S, S[P]>
// or (deprecated)
<S, P extends keyof T>(prop: P): Lens<S, S[P]>
```

generate a lens from a type and a prop

Example

```ts
type Person = {
  name: string
  age: number
}

const age = Lens.fromProp<Person>()('age')
// or (deprecated)
// const age = Lens.fromProp<Person, 'age'>('age')

const person: Person = { name: 'Giulio', age: 43 }

console.log(age.get(person)) // 43
console.log(age.set(44)(person)) // { name: 'Giulio', age: 44 }
```

## fromProps

```ts
<S>(): <P extends keyof S>(props: Array<P>) => Lens<S, { [K in P]: S[K] }>
```

generate a lens from a type and an array of props

Example

```ts
interface Person {
  name: string
  age: number
  rememberMe: boolean
}

const lens = Lens.fromProps<Person>()(['name', 'age'])

const person: Person = { name: 'Giulio', age: 44, rememberMe: true }

console.log(lens.get(person)) // { name: 'Giulio', age: 44 }
console.log(lens.set({ name: 'Guido', age: 47 })(person)) // { name: 'Guido', age: 47, rememberMe: true }
```

## fromNullableProp

```ts
<S>(): <A extends S[K], K extends keyof S>(k: K, defaultValue: A) => Lens<S, A>
// or (deprecated)
<S, A extends S[K], K extends keyof S>(k: K, defaultValue: A): Lens<S, A>
```

generate a lens from a type and a prop whose type is nullable

Example

```ts
interface Outer {
  inner?: Inner
}

interface Inner {
  value: number
  foo: string
}

const inner = Lens.fromNullableProp<Outer>()('inner', { value: 0, foo: 'foo' })
const value = Lens.fromProp<Inner>()('value')
const lens = inner.compose(value)

console.log(lens.set(1)({})) // { inner: { value: 1, foo: 'foo' } }
console.log(lens.get({})) // 0
console.log(lens.set(1)({ inner: { value: 1, foo: 'bar' } })) // { inner: { value: 1, foo: 'bar' } }
console.log(lens.get({ inner: { value: 1, foo: 'bar' } })) // 1
```

## Methods

### modify

```ts
(f: (a: A) => A): (s: S) => S
```

### asOptional

```ts
(): Optional<S, A>
```

view a Lens as a Optional

### asTraversal

```ts
(): Traversal<S, A>
```

view a Lens as a Traversal

### asSetter

```ts
(): Setter<S, A>
```

view a Lens as a Setter

### asGetter

```ts
(): Getter<S, A>
```

view a Lens as a Getter

### asFold

```ts
(): Fold<S, A>
```

view a Lens as a Fold

### compose

```ts
<B>(ab: Lens<A, B>): Lens<S, B>
```

compose a Lens with a Lens

### composeGetter

```ts
<B>(ab: Getter<A, B>): Getter<S, B>
```

compose a Lens with a Getter

### composeFold

```ts
<B>(ab: Fold<A, B>): Fold<S, B>
```

compose a Lens with a Fold

### composeOptional

```ts
<B>(ab: Optional<A, B>): Optional<S, B>
```

compose a Lens with an Optional

### composeTraversal

```ts
<B>(ab: Traversal<A, B>): Traversal<S, B>
```

compose a Lens with an Traversal

### composeSetter

```ts
<B>(ab: Setter<A, B>): Setter<S, B>
```

compose a Lens with an Setter

### composeIso

```ts
<B>(ab: Iso<A, B>): Lens<S, B>
```

compose a Lens with an Iso

### composePrism

```ts
<B>(ab: Prism<A, B>): Optional<S, B>
```

compose a Lens with a Prism

# Prism

```ts
class Prism<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly reverseGet: (a: A) => S)
}
```

## fromPredicate

```ts
<A>(predicate: Predicate<A>): Prism<A, A>
```

## some

```ts
<A>(): Prism<Option<A>, A>
```

## Methods

### modify

```ts
(f: (a: A) => A): (s: S) => S
```

### modifyOption

```ts
(f: (a: A) => A): (s: S) => Option<S>
```

### set

```ts
(a: A): (s: S) => S
```

set the target of a Prism with a value

### asOptional

```ts
(): Optional<S, A>
```

view a Prism as a Optional

### asTraversal

```ts
(): Traversal<S, A>
```

view a Prism as a Traversal

### asSetter

```ts
(): Setter<S, A>
```

view a Prism as a Setter

### asFold

```ts
(): Fold<S, A>
```

view a Prism as a Fold

### compose

```ts
<B>(ab: Prism<A, B>): Prism<S, B>
```

compose a Prism with a Prism

### composeOptional

```ts
<B>(ab: Optional<A, B>): Optional<S, B>
```

compose a Prism with a Optional

### composeTraversal

```ts
<B>(ab: Traversal<A, B>): Traversal<S, B>
```

compose a Prism with a Traversal

### composeFold

```ts
<B>(ab: Fold<A, B>): Fold<S, B>
```

compose a Prism with a Fold

### composeSetter

```ts
<B>(ab: Setter<A, B>): Setter<S, B>
```

compose a Prism with a Setter

### composeIso

```ts
<B>(ab: Iso<A, B>): Prism<S, B>
```

compose a Prism with a Iso

### composeLens

```ts
<B>(ab: Lens<A, B>): Optional<S, B>
```

compose a Prism with a Lens

### composeGetter

```ts
<B>(ab: Getter<A, B>): Fold<S, B>
```

compose a Prism with a Getter

# Optional

```ts
class Optional<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly set: (a: A) => (s: S) => S) {}
}
```

## fromNullableProp

```ts
<S>() <K extends keyof S>(k: K): Optional<S, NonNullable<S[K]>>
// or (deprecated)
<S, A extends S[K], K extends keyof S>(k: K): Optional<S, A>
```

Example

```ts
interface Phone {
  number: string
}
interface Employment {
  phone?: Phone
}
interface Info {
  employment?: Employment
}
interface Response {
  info?: Info
}

const info = Optional.fromNullableProp<Response>()('info')
const employment = Optional.fromNullableProp<Info>()('employment')
const phone = Optional.fromNullableProp<Employment>()('phone')
const number = Lens.fromProp<Phone>()('number')
const numberFromResponse = info
  .compose(employment)
  .compose(phone)
  .composeLens(number)

const response1: Response = {
  info: {
    employment: {
      phone: {
        number: '555-1234'
      }
    }
  }
}
const response2: Response = {
  info: {
    employment: {}
  }
}

numberFromResponse.getOption(response1) // some('555-1234')
numberFromResponse.getOption(response2) // none
```

## fromOptionProp

```ts
<S>(): <P extends OptionPropertyNames<S>>(prop: P) => Optional<S, OptionPropertyType<S, P>>
<S>(prop: OptionPropertyNames<S>) => Optional<S, OptionPropertyType<S, typeof prop>>
```

Example

```ts
interface Phone {
  number: string
}
interface Employment {
  phone: Option<Phone>
}
interface Info {
  employment: Option<Employment>
}
interface Response {
  info: Option<Info>
}

const info = Optional.fromOptionProp<Response>('info')
const employment = Optional.fromOptionProp<Info>('employment')
const phone = Optional.fromOptionProp<Employment>('phone')
const number = Lens.fromProp<Phone>()('number')
const numberFromResponse = info
  .compose(employment)
  .compose(phone)
  .composeLens(number)
```

## Methods

### modify

```ts
(f: (a: A) => A): (s: S) => S
```

### modifyOption

```ts
(f: (a: A) => A): (s: S) => Option<S>
```

### asTraversal

```ts
(): Traversal<S, A>
```

view a Optional as a Traversal

### asFold

```ts
(): Fold<S, A>
```

view an Optional as a Fold

### asSetter

```ts
(): Setter<S, A>
```

view an Optional as a Setter

### compose

```ts
<B>(ab: Optional<A, B>): Optional<S, B>
```

compose a Optional with a Optional

### composeTraversal

```ts
<B>(ab: Traversal<A, B>): Traversal<S, B>
```

compose an Optional with a Traversal

### composeFold

```ts
<B>(ab: Fold<A, B>): Fold<S, B>
```

compose an Optional with a Fold

### composeSetter

```ts
<B>(ab: Setter<A, B>): Setter<S, B>
```

compose an Optional with a Setter

### composeLens

```ts
<B>(ab: Lens<A, B>): Optional<S, B>
```

compose an Optional with a Lens

### composePrism

```ts
<B>(ab: Prism<A, B>): Optional<S, B>
```

compose an Optional with a Prism

### composeIso

```ts
<B>(ab: Iso<A, B>): Optional<S, B>
```

compose an Optional with a Iso

### composeGetter

```ts
<B>(ab: Getter<A, B>): Fold<S, B>
```

compose an Optional with a Getter

# Traversal

```ts
class Traversal<S, A> {
  constructor(readonly modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>)
}
```

an optic that focuses on multiple elements in a data structure. See [fromTraversable](#fromTraversable)

## Methods

### modify

```ts
(f: (a: A) => A): (s: S) => S
```

modify each element focused by a traversal using the passed function

### set

```ts
(a: A): (s: S) => S
```

set the value of each element focused by the traversal

### asFold

```ts
(): Fold<S, A>
```

view a Traversal as a Fold

### asSetter

```ts
(): Setter<S, A>
```

view a Traversal as a Setter

### compose

```ts
<B>(ab: Traversal<A, B>): Traversal<S, B>
```

compose a Traversal with another Traversal

### composeFold

```ts
<B>(ab: Fold<A, B>): Fold<S, B>
```

compose a Traversal with a Fold

### composeSetter

```ts
<B>(ab: Setter<A, B>): Setter<S, B>
```

compose a Traversal with a Setter

### composeOptional

```ts
<B>(ab: Optional<A, B>): Traversal<S, B>
```

compose a Traversal with a Optional

### composeLens

```ts
<B>(ab: Lens<A, B>): Traversal<S, B>
```

compose a Traversal with a Lens

### composePrism

```ts
<B>(ab: Prism<A, B>): Traversal<S, B>
```

compose a Traversal with a Prism

### composeIso

```ts
<B>(ab: Iso<A, B>): Traversal<S, B>
```

compose a Traversal with a Iso

### composeGetter

```ts
<B>(ab: Getter<A, B>): Fold<S, B>
```

compose a Traversal with a Getter

# Getter

```ts
class Getter<S, A> {
  constructor(readonly get: (s: S) => A)
}
```

## Methods

### asFold

```ts
(): Fold<S, A>
```

view a Getter as a Fold

### compose

```ts
<B>(ab: Getter<A, B>): Getter<S, B>
```

compose a Getter with a Getter

### composeFold

```ts
<B>(ab: Fold<A, B>): Fold<S, B>
```

compose a Getter with a Fold

### composeLens

```ts
<B>(ab: Lens<A, B>): Getter<S, B>
```

compose a Getter with a Lens

### composeIso

```ts
<B>(ab: Iso<A, B>): Getter<S, B>
```

compose a Getter with a Iso

### composeTraversal

```ts
<B>(ab: Traversal<A, B>): Fold<S, B>
```

compose a Getter with a Optional

### composeOptional

```ts
<B>(ab: Optional<A, B>): Fold<S, B>
```

compose a Getter with a Optional

### composePrism

```ts
<B>(ab: Prism<A, B>): Fold<S, B>
```

compose a Getter with a Prism

# Fold

```ts
class Fold<S, A> {
  constructor(readonly foldMap: <M>(M: Monoid<M>) => (f: (a: A) => M) => (s: S) => M)
}
```

## Methods

### compose

```ts
<B>(ab: Fold<A, B>): Fold<S, B>
```

compose a Fold with a Fold

### composeGetter

```ts
<B>(ab: Getter<A, B>): Fold<S, B>
```

compose a Fold with a Getter

### composeTraversal

```ts
<B>(ab: Traversal<A, B>): Fold<S, B>
```

compose a Fold with a Traversal

### composeOptional

```ts
<B>(ab: Optional<A, B>): Fold<S, B>
```

compose a Fold with a Optional

### composeLens

```ts
<B>(ab: Lens<A, B>): Fold<S, B>
```

compose a Fold with a Lens

### composePrism

```ts
<B>(ab: Prism<A, B>): Fold<S, B>
```

compose a Fold with a Prism

### composeIso

```ts
<B>(ab: Iso<A, B>): Fold<S, B>
```

compose a Fold with a Iso

### find

```ts
(p: Predicate<A>): (s: S) => Option<A>
```

find the first target of a Fold matching the predicate

### headOption

```ts
(s: S): Option<A>
```

get the first target of a Fold

### getAll

```ts
(s: S): Array<A>
```

get all the targets of a Fold

### exist

```ts
(p: Predicate<A>): Predicate<S>
```

check if at least one target satisfies the predicate

### all

```ts
(p: Predicate<A>): Predicate<S>
```

check if all targets satisfy the predicate

# Setter

```ts
class Setter<S, A> {
  constructor(readonly modify: (f: (a: A) => A) => (s: S) => S)
}
```

## Methods

### set

```ts
(a: A): (s: S) => S
```

### compose

```ts
<B>(ab: Setter<A, B>): Setter<S, B>
```

compose a Setter with a Setter

### composeTraversal

```ts
<B>(ab: Traversal<A, B>): Setter<S, B>
```

compose a Setter with a Traversal

### composeOptional

```ts
<B>(ab: Optional<A, B>): Setter<S, B>
```

compose a Setter with a Optional

### composeLens

```ts
<B>(ab: Lens<A, B>): Setter<S, B>
```

compose a Setter with a Lens

### composePrism

```ts
<B>(ab: Prism<A, B>): Setter<S, B>
```

compose a Setter with a Prism

### composeIso

```ts
<B>(ab: Iso<A, B>): Setter<S, B>
```

compose a Setter with a Iso

# fromTraversable

```ts
<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
```

create a Traversal from a Traversable

Example: reversing strings in a nested array

```ts
import { Lens, fromTraversable } from 'monocle-ts'
import { array } from 'fp-ts/lib/Array'

interface Tweet {
  text: string
}

interface Tweets {
  tweets: Tweet[]
}

const tweetsLens = Lens.fromProp<Tweets>()('tweets')
const tweetTextLens = Lens.fromProp<Tweet>()('text')
const tweetTraversal = fromTraversable(array)<Tweet>()
const composedTraversal = tweetsLens.composeTraversal(tweetTraversal).composeLens(tweetTextLens)

const tweet1: Tweet = { text: 'hello world' }
const tweet2: Tweet = { text: 'foobar' }
const model: Tweets = { tweets: [tweet1, tweet2] }

const newModel = composedTraversal.modify(text =>
  text
    .split('')
    .reverse()
    .join('')
)(model)
// { tweets: [ { text: 'dlrow olleh' }, { text: 'raboof' } ] }
```

# fromFoldable

```ts
<F>(F: Foldable<F>): <A>() => Fold<HKT<F, A>, A>
```

create a Fold from a Foldable

# At

## Methods

### fromIso

lift an instance of `At` using an `Iso`

```ts
<T>(iso: Iso<T, S>): At<T, I, A>
```

## Instances

### Set

#### atSet

```ts
<A = never>(setoid: Setoid<A>): At<Set<A>, A, boolean>
```

### StrMap

#### atStrMap

```ts
<A = never>(): At<SM.StrMap<A>, string, Option<A>>
```

# Index

## fromAt

```ts
<T, J, B>(at: At<T, J, Option<B>>): Index<T, J, B>
```

## Methods

### fromIso

lift an instance of `Index` using an `Iso`

```ts
<T>(iso: Iso<T, S>): Index<T, I, A>
```

## Instances

### Array

#### indexArray

```ts
<A = never>(): Index<Array<A>, number, A>
```

### StrMap

#### indexStrMap

```ts
<A = never>(): Index<StrMap<A>, string, A>
```
