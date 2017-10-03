A (partial) porting of scala [monocle](https://github.com/julien-truffaut/Monocle) library to TypeScript

# Motivation

(Adapted from [monocle site](http://julien-truffaut.github.io/Monocle/))

Modifying immutable nested object in JavaScript is verbose which makes code difficult to understand and reason about.

Let's have a look at some examples:

```ts
interface Street { num: number, name: string }
interface Address { city: string, street: Street }
interface Company { name: string, address: Address }
interface Employee { name: string, company: Company }
```

Let’s say we have an employee and we need to upper case the first character of his company street name. Here is how we could write it in vanilla JavaScript

```ts
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

As we can see copy is not convenient to update nested objects because we need to repeat ourselves. Let's see what could we do with `monocle-ts`

```ts
import { Lens, Optional } from 'monocle-ts'

const company = Lens.fromProp<Employee, 'company'>('company')
const address = Lens.fromProp<Company, 'address'>('address')
const street = Lens.fromProp<Address, 'street'>('street')
const name = Lens.fromProp<Street, 'name'>('name')

company.compose(address).compose(street).compose(name)
```

`compose` takes two `Lenses`, one from `A` to `B` and another one from `B` to `C` and creates a third `Lens` from `A` to `C`.
Therefore, after composing `company`, `address`, `street` and `name`, we obtain a `Lens` from `Employee` to `string` (the street name).
Now we can use this `Lens` issued from the composition to modify the street name using the function `capitalize`

```ts
company
  .compose(address)
  .compose(street)
  .compose(name)
  .modify(capitalize)(employee)
```

Here `modify` lift a function `string => string` to a function `Employee => Employee`. It works but it would be clearer if we could zoom
into the first character of a `string` with a `Lens`. However, we cannot write such a `Lens` because `Lenses` require the field they are directed
at to be *mandatory*. In our case the first character of a `string` is optional as a `string` can be empty. So we need another abstraction that
would be a sort of partial Lens, in `monocle-ts` it is called an `Optional`.

```ts
import { some, none } from 'fp-ts/lib/Option'

const firstLetter = new Optional<string, string>(
  s => s.length > 0 ? some(s[0]) : none,
  a => s => a + s.substring(1)
)

company
  .compose(address)
  .compose(street)
  .compose(name)
  .asOptional()
  .compose(firstLetter)
  .modify(s => s.toUpperCase())(employee)
```

Similarly to `compose` for lenses, `compose` for optionals takes two `Optionals`, one from `A` to `B` and another from `B` to `C` and creates a third `Optional` from `A` to `C`.
All `Lenses` can be seen as `Optionals` where the optional element to zoom into is always present, hence composing an `Optional` and a `Lens` always produces an `Optional`.

# Iso

```ts
class Iso<S, A> {
  constructor(readonly get: (s: S) => A, readonly reverseGet: (a: A) => S)
}
```

## Methods

### unwrap

```ts
(s: S) => A
```

Alias of `get`

### to

```ts
(s: S) => A
```

Alias of `get`

### wrap

```ts
(a: A) => S
```

Alias of `reverseGet`

### from

```ts
(a: A) => S
```

Alias of `reverseGet`

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
// other 9 overloadings
<T, K1 extends keyof T>(path: [K1]): Lens<T, T[K1]>
```

Example

```ts
type Person = {
  name: string
  age: number
}

const age = Lens.fromProp<Person, 'age'>('age')

const person: Person = { name: 'Giulio', age: 43 }

console.log(age.get(person)) // 43
console.log(age.set(44)(person)) // { name: 'Giulio', age: 44 }
```

## fromProp

```ts
<T, P extends keyof T>(prop: P): Lens<T, T[P]>
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

const city = Lens.fromPath<Person, 'address', 'city'>(['address', 'city'])

const person: Person = { name: 'Giulio', age: 43, address: { city: 'Milan' } }

console.log(city.get(person)) // Milan
console.log(city.set('London')(person)) // { name: 'Giulio', age: 43, address: { city: 'London' } }
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

TODO

# Optional

TODO

# Traversal

TODO

# Getter

TODO

# Fold

TODO

# Setter

TODO

# fromTraversable

```ts
<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
```

create a Traversal from a Traversable

# fromFoldable

```ts
<F>(F: Foldable<F>): <A>() => Fold<HKT<F, A>, A>
```

create a Fold from a Foldable
