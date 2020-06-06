---
title: index.ts
nav_order: 6
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructor](#constructor)
  - [At (class)](#at-class)
    - [fromIso (method)](#fromiso-method)
    - [\_tag (property)](#_tag-property)
  - [Fold (class)](#fold-class)
    - [compose (method)](#compose-method)
    - [composeFold (method)](#composefold-method)
    - [composeGetter (method)](#composegetter-method)
    - [composeTraversal (method)](#composetraversal-method)
    - [composeOptional (method)](#composeoptional-method)
    - [composeLens (method)](#composelens-method)
    - [composePrism (method)](#composeprism-method)
    - [composeIso (method)](#composeiso-method)
    - [find (method)](#find-method)
    - [headOption (method)](#headoption-method)
    - [\_tag (property)](#_tag-property-1)
    - [getAll (property)](#getall-property)
    - [exist (property)](#exist-property)
    - [all (property)](#all-property)
  - [Getter (class)](#getter-class)
    - [asFold (method)](#asfold-method)
    - [compose (method)](#compose-method-1)
    - [composeGetter (method)](#composegetter-method-1)
    - [composeFold (method)](#composefold-method-1)
    - [composeLens (method)](#composelens-method-1)
    - [composeIso (method)](#composeiso-method-1)
    - [composeTraversal (method)](#composetraversal-method-1)
    - [composeOptional (method)](#composeoptional-method-1)
    - [composePrism (method)](#composeprism-method-1)
    - [\_tag (property)](#_tag-property-2)
  - [Index (class)](#index-class)
    - [fromAt (static method)](#fromat-static-method)
    - [fromIso (method)](#fromiso-method-1)
    - [\_tag (property)](#_tag-property-3)
  - [Iso (class)](#iso-class)
    - [reverse (method)](#reverse-method)
    - [modify (method)](#modify-method)
    - [asLens (method)](#aslens-method)
    - [asPrism (method)](#asprism-method)
    - [asOptional (method)](#asoptional-method)
    - [asTraversal (method)](#astraversal-method)
    - [asFold (method)](#asfold-method-1)
    - [asGetter (method)](#asgetter-method)
    - [asSetter (method)](#assetter-method)
    - [compose (method)](#compose-method-2)
    - [composeIso (method)](#composeiso-method-2)
    - [composeLens (method)](#composelens-method-2)
    - [composePrism (method)](#composeprism-method-2)
    - [composeOptional (method)](#composeoptional-method-2)
    - [composeTraversal (method)](#composetraversal-method-2)
    - [composeFold (method)](#composefold-method-2)
    - [composeGetter (method)](#composegetter-method-2)
    - [composeSetter (method)](#composesetter-method)
    - [\_tag (property)](#_tag-property-4)
    - [unwrap (property)](#unwrap-property)
    - [to (property)](#to-property)
    - [wrap (property)](#wrap-property)
    - [from (property)](#from-property)
  - [Lens (class)](#lens-class)
    - [fromPath (static method)](#frompath-static-method)
    - [fromProp (static method)](#fromprop-static-method)
    - [fromProps (static method)](#fromprops-static-method)
    - [fromNullableProp (static method)](#fromnullableprop-static-method)
    - [modify (method)](#modify-method-1)
    - [asOptional (method)](#asoptional-method-1)
    - [asTraversal (method)](#astraversal-method-1)
    - [asSetter (method)](#assetter-method-1)
    - [asGetter (method)](#asgetter-method-1)
    - [asFold (method)](#asfold-method-2)
    - [compose (method)](#compose-method-3)
    - [composeLens (method)](#composelens-method-3)
    - [composeGetter (method)](#composegetter-method-3)
    - [composeFold (method)](#composefold-method-3)
    - [composeOptional (method)](#composeoptional-method-3)
    - [composeTraversal (method)](#composetraversal-method-3)
    - [composeSetter (method)](#composesetter-method-1)
    - [composeIso (method)](#composeiso-method-3)
    - [composePrism (method)](#composeprism-method-3)
    - [\_tag (property)](#_tag-property-5)
  - [Optional (class)](#optional-class)
    - [fromPath (static method)](#frompath-static-method-1)
    - [fromNullableProp (static method)](#fromnullableprop-static-method-1)
    - [fromOptionProp (static method)](#fromoptionprop-static-method)
    - [modify (method)](#modify-method-2)
    - [modifyOption (method)](#modifyoption-method)
    - [asTraversal (method)](#astraversal-method-2)
    - [asFold (method)](#asfold-method-3)
    - [asSetter (method)](#assetter-method-2)
    - [compose (method)](#compose-method-4)
    - [composeOptional (method)](#composeoptional-method-4)
    - [composeTraversal (method)](#composetraversal-method-4)
    - [composeFold (method)](#composefold-method-4)
    - [composeSetter (method)](#composesetter-method-2)
    - [composeLens (method)](#composelens-method-4)
    - [composePrism (method)](#composeprism-method-4)
    - [composeIso (method)](#composeiso-method-4)
    - [composeGetter (method)](#composegetter-method-4)
    - [\_tag (property)](#_tag-property-6)
  - [Prism (class)](#prism-class)
    - [fromPredicate (static method)](#frompredicate-static-method)
    - [some (static method)](#some-static-method)
    - [modify (method)](#modify-method-3)
    - [modifyOption (method)](#modifyoption-method-1)
    - [set (method)](#set-method)
    - [asOptional (method)](#asoptional-method-2)
    - [asTraversal (method)](#astraversal-method-3)
    - [asSetter (method)](#assetter-method-3)
    - [asFold (method)](#asfold-method-4)
    - [compose (method)](#compose-method-5)
    - [composePrism (method)](#composeprism-method-5)
    - [composeOptional (method)](#composeoptional-method-5)
    - [composeTraversal (method)](#composetraversal-method-5)
    - [composeFold (method)](#composefold-method-5)
    - [composeSetter (method)](#composesetter-method-3)
    - [composeIso (method)](#composeiso-method-5)
    - [composeLens (method)](#composelens-method-5)
    - [composeGetter (method)](#composegetter-method-5)
    - [\_tag (property)](#_tag-property-7)
  - [Setter (class)](#setter-class)
    - [set (method)](#set-method-1)
    - [compose (method)](#compose-method-6)
    - [composeSetter (method)](#composesetter-method-4)
    - [composeTraversal (method)](#composetraversal-method-6)
    - [composeOptional (method)](#composeoptional-method-6)
    - [composeLens (method)](#composelens-method-6)
    - [composePrism (method)](#composeprism-method-6)
    - [composeIso (method)](#composeiso-method-6)
    - [\_tag (property)](#_tag-property-8)
  - [Traversal (class)](#traversal-class)
    - [modify (method)](#modify-method-4)
    - [set (method)](#set-method-2)
    - [filter (method)](#filter-method)
    - [asFold (method)](#asfold-method-5)
    - [asSetter (method)](#assetter-method-4)
    - [compose (method)](#compose-method-7)
    - [composeTraversal (method)](#composetraversal-method-7)
    - [composeFold (method)](#composefold-method-6)
    - [composeSetter (method)](#composesetter-method-5)
    - [composeOptional (method)](#composeoptional-method-7)
    - [composeLens (method)](#composelens-method-7)
    - [composePrism (method)](#composeprism-method-7)
    - [composeIso (method)](#composeiso-method-7)
    - [composeGetter (method)](#composegetter-method-6)
    - [\_tag (property)](#_tag-property-9)
  - [fromFoldable](#fromfoldable)
  - [fromTraversable](#fromtraversable)
- [utils](#utils)
  - [LensFromPath (interface)](#lensfrompath-interface)
  - [ModifyF (interface)](#modifyf-interface)
  - [OptionalFromPath (interface)](#optionalfrompath-interface)

---

# constructor

## At (class)

**Signature**

```ts
export declare class At<S, I, A> {
  constructor(readonly at: (i: I) => Lens<S, A>)
}
```

Added in v1.2.0

### fromIso (method)

lift an instance of `At` using an `Iso`

**Signature**

```ts
fromIso<T>(iso: Iso<T, S>): At<T, I, A>
```

Added in v1.2.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "At"
```

Added in v1.0.0

## Fold (class)

**Signature**

```ts
export declare class Fold<S, A> {
  constructor(readonly foldMap: <M>(M: Monoid<M>) => (f: (a: A) => M) => (s: S) => M)
}
```

Added in v1.0.0

### compose (method)

compose a `Fold` with a `Fold`

**Signature**

```ts
compose<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeFold (method)

Alias of `compose`

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeGetter (method)

compose a `Fold` with a `Getter`

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeTraversal (method)

compose a `Fold` with a `Traversal`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeOptional (method)

compose a `Fold` with a `Optional`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeLens (method)

compose a `Fold` with a `Lens`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Fold<S, B>
```

Added in v1.0.0

### composePrism (method)

compose a `Fold` with a `Prism`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeIso (method)

compose a `Fold` with a `Iso`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Fold<S, B>
```

Added in v1.0.0

### find (method)

find the first target of a `Fold` matching the predicate

**Signature**

```ts
find<B extends A>(p: Refinement<A, B>): (s: S) => Option<B>
find(p: Predicate<A>): (s: S) => Option<A>
```

Added in v1.0.0

### headOption (method)

get the first target of a `Fold`

**Signature**

```ts
headOption(s: S): Option<A>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Fold"
```

Added in v1.0.0

### getAll (property)

get all the targets of a `Fold`

**Signature**

```ts
readonly getAll: (s: S) => A[]
```

Added in v1.0.0

### exist (property)

check if at least one target satisfies the predicate

**Signature**

```ts
readonly exist: (p: Predicate<A>) => Predicate<S>
```

Added in v1.0.0

### all (property)

check if all targets satisfy the predicate

**Signature**

```ts
readonly all: (p: Predicate<A>) => Predicate<S>
```

Added in v1.0.0

## Getter (class)

**Signature**

```ts
export declare class Getter<S, A> {
  constructor(readonly get: (s: S) => A)
}
```

Added in v1.0.0

### asFold (method)

view a `Getter` as a `Fold`

**Signature**

```ts
asFold(): Fold<S, A>
```

Added in v1.0.0

### compose (method)

compose a `Getter` with a `Getter`

**Signature**

```ts
compose<B>(ab: Getter<A, B>): Getter<S, B>
```

Added in v1.0.0

### composeGetter (method)

Alias of `compose`

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B>
```

Added in v1.0.0

### composeFold (method)

compose a `Getter` with a `Fold`

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeLens (method)

compose a `Getter` with a `Lens`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Getter<S, B>
```

Added in v1.0.0

### composeIso (method)

compose a `Getter` with a `Iso`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Getter<S, B>
```

Added in v1.0.0

### composeTraversal (method)

compose a `Getter` with a `Optional`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeOptional (method)

compose a `Getter` with a `Optional`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B>
```

Added in v1.0.0

### composePrism (method)

compose a `Getter` with a `Prism`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Getter"
```

Added in v1.0.0

## Index (class)

**Signature**

```ts
export declare class Index<S, I, A> {
  constructor(readonly index: (i: I) => Optional<S, A>)
}
```

Added in v1.2.0

### fromAt (static method)

**Signature**

```ts
static fromAt<T, J, B>(at: At<T, J, Option<B>>): Index<T, J, B>
```

Added in v1.2.0

### fromIso (method)

lift an instance of `Index` using an `Iso`

**Signature**

```ts
fromIso<T>(iso: Iso<T, S>): Index<T, I, A>
```

Added in v1.2.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Index"
```

Added in v1.0.0

## Iso (class)

Laws:

1. reverseGet(get(s)) = s
2. get(reversetGet(a)) = a

**Signature**

```ts
export declare class Iso<S, A> {
  constructor(readonly get: (s: S) => A, readonly reverseGet: (a: A) => S)
}
```

Added in v1.0.0

### reverse (method)

reverse the `Iso`: the source becomes the target and the target becomes the source

**Signature**

```ts
reverse(): Iso<A, S>
```

Added in v1.0.0

### modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S
```

Added in v1.0.0

### asLens (method)

view an `Iso` as a `Lens`

**Signature**

```ts
asLens(): Lens<S, A>
```

Added in v1.0.0

### asPrism (method)

view an `Iso` as a `Prism`

**Signature**

```ts
asPrism(): Prism<S, A>
```

Added in v1.0.0

### asOptional (method)

view an `Iso` as a `Optional`

**Signature**

```ts
asOptional(): Optional<S, A>
```

Added in v1.0.0

### asTraversal (method)

view an `Iso` as a `Traversal`

**Signature**

```ts
asTraversal(): Traversal<S, A>
```

Added in v1.0.0

### asFold (method)

view an `Iso` as a `Fold`

**Signature**

```ts
asFold(): Fold<S, A>
```

Added in v1.0.0

### asGetter (method)

view an `Iso` as a `Getter`

**Signature**

```ts
asGetter(): Getter<S, A>
```

Added in v1.0.0

### asSetter (method)

view an `Iso` as a `Setter`

**Signature**

```ts
asSetter(): Setter<S, A>
```

Added in v1.0.0

### compose (method)

compose an `Iso` with an `Iso`

**Signature**

```ts
compose<B>(ab: Iso<A, B>): Iso<S, B>
```

Added in v1.0.0

### composeIso (method)

Alias of `compose`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Iso<S, B>
```

Added in v1.0.0

### composeLens (method)

compose an `Iso` with a `Lens`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B>
```

Added in v1.0.0

### composePrism (method)

compose an `Iso` with a `Prism`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B>
```

Added in v1.0.0

### composeOptional (method)

compose an `Iso` with an `Optional`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeTraversal (method)

compose an `Iso` with a `Traversal`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeFold (method)

compose an `Iso` with a `Fold`

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeGetter (method)

compose an `Iso` with a `Getter`

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B>
```

Added in v1.0.0

### composeSetter (method)

compose an `Iso` with a `Setter`

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Iso"
```

Added in v1.0.0

### unwrap (property)

**Signature**

```ts
readonly unwrap: (s: S) => A
```

Added in v1.0.0

### to (property)

**Signature**

```ts
readonly to: (s: S) => A
```

Added in v1.0.0

### wrap (property)

**Signature**

```ts
readonly wrap: (a: A) => S
```

Added in v1.0.0

### from (property)

**Signature**

```ts
readonly from: (a: A) => S
```

Added in v1.0.0

## Lens (class)

Laws:

1. get(set(a)(s)) = a
2. set(get(s))(s) = s
3. set(a)(set(a)(s)) = set(a)(s)

**Signature**

```ts
export declare class Lens<S, A> {
  constructor(readonly get: (s: S) => A, readonly set: (a: A) => (s: S) => S)
}
```

Added in v1.0.0

### fromPath (static method)

**Signature**

```ts
static fromPath<S>(): LensFromPath<S>
```

**Example**

```ts
import { Lens } from 'monocle-ts'

type Person = {
  name: string
  age: number
  address: {
    city: string
  }
}

const city = Lens.fromPath<Person>()(['address', 'city'])

const person: Person = { name: 'Giulio', age: 43, address: { city: 'Milan' } }

assert.strictEqual(city.get(person), 'Milan')
assert.deepStrictEqual(city.set('London')(person), { name: 'Giulio', age: 43, address: { city: 'London' } })
```

Added in v1.0.0

### fromProp (static method)

Returns a `Lens` from a type and a prop

**Signature**

```ts
static fromProp<S>(): <P extends keyof S>(prop: P) => Lens<S, S[P]>
```

**Example**

```ts
import { Lens } from 'monocle-ts'

type Person = {
  name: string
  age: number
}

const age = Lens.fromProp<Person>()('age')

const person: Person = { name: 'Giulio', age: 43 }

assert.strictEqual(age.get(person), 43)
assert.deepStrictEqual(age.set(44)(person), { name: 'Giulio', age: 44 })
```

Added in v1.0.0

### fromProps (static method)

Returns a `Lens` from a type and an array of props

**Signature**

```ts
static fromProps<S>(): <P extends keyof S>(props: Array<P>) => Lens<S, { [K in P]: S[K] }>
```

**Example**

```ts
import { Lens } from 'monocle-ts'

interface Person {
  name: string
  age: number
  rememberMe: boolean
}

const lens = Lens.fromProps<Person>()(['name', 'age'])

const person: Person = { name: 'Giulio', age: 44, rememberMe: true }

assert.deepStrictEqual(lens.get(person), { name: 'Giulio', age: 44 })
assert.deepStrictEqual(lens.set({ name: 'Guido', age: 47 })(person), { name: 'Guido', age: 47, rememberMe: true })
```

Added in v1.0.0

### fromNullableProp (static method)

Returns a `Lens` from a nullable (`A | null | undefined`) prop

**Signature**

```ts
static fromNullableProp<S>(): <A extends S[K], K extends keyof S>(
    k: K,
    defaultValue: A
  ) => Lens<S, NonNullable<S[K]>>
```

**Example**

```ts
import { Lens } from 'monocle-ts'

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

assert.deepStrictEqual(lens.set(1)({})), { inner: { value: 1, foo: 'foo' } })
assert.strictEqual(lens.get({})), 0)
assert.deepStrictEqual(lens.set(1)({ inner: { value: 1, foo: 'bar' } })), { inner: { value: 1, foo: 'bar' } })
assert.strictEqual(lens.get({ inner: { value: 1, foo: 'bar' } })), 1)
```

Added in v1.0.0

### modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S
```

Added in v1.0.0

### asOptional (method)

view a `Lens` as a Optional

**Signature**

```ts
asOptional(): Optional<S, A>
```

Added in v1.0.0

### asTraversal (method)

view a `Lens` as a `Traversal`

**Signature**

```ts
asTraversal(): Traversal<S, A>
```

Added in v1.0.0

### asSetter (method)

view a `Lens` as a `Setter`

**Signature**

```ts
asSetter(): Setter<S, A>
```

Added in v1.0.0

### asGetter (method)

view a `Lens` as a `Getter`

**Signature**

```ts
asGetter(): Getter<S, A>
```

Added in v1.0.0

### asFold (method)

view a `Lens` as a `Fold`

**Signature**

```ts
asFold(): Fold<S, A>
```

Added in v1.0.0

### compose (method)

compose a `Lens` with a `Lens`

**Signature**

```ts
compose<B>(ab: Lens<A, B>): Lens<S, B>
```

Added in v1.0.0

### composeLens (method)

Alias of `compose`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B>
```

Added in v1.0.0

### composeGetter (method)

compose a `Lens` with a `Getter`

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B>
```

Added in v1.0.0

### composeFold (method)

compose a `Lens` with a `Fold`

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeOptional (method)

compose a `Lens` with an `Optional`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeTraversal (method)

compose a `Lens` with an `Traversal`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeSetter (method)

compose a `Lens` with an `Setter`

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeIso (method)

compose a `Lens` with an `Iso`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Lens<S, B>
```

Added in v1.0.0

### composePrism (method)

compose a `Lens` with a `Prism`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Lens"
```

Added in v1.0.0

## Optional (class)

Laws:

1. getOption(s).fold(() => s, a => set(a)(s)) = s
2. getOption(set(a)(s)) = getOption(s).map(\_ => a)
3. set(a)(set(a)(s)) = set(a)(s)

**Signature**

```ts
export declare class Optional<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly set: (a: A) => (s: S) => S)
}
```

Added in v1.0.0

### fromPath (static method)

Returns an `Optional` from a nullable (`A | null | undefined`) prop

**Signature**

```ts
static fromPath<S>(): OptionalFromPath<S>
```

**Example**

```ts
import { Optional } from 'monocle-ts'

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

const numberFromResponse = Optional.fromPath<Response>()(['info', 'employment', 'phone', 'number'])

const response1: Response = {
  info: {
    employment: {
      phone: {
        number: '555-1234',
      },
    },
  },
}
const response2: Response = {
  info: {
    employment: {},
  },
}

numberFromResponse.getOption(response1) // some('555-1234')
numberFromResponse.getOption(response2) // none
```

Added in v2.1.0

### fromNullableProp (static method)

**Signature**

```ts
static fromNullableProp<S>(): <K extends keyof S>(k: K) => Optional<S, NonNullable<S[K]>>
```

**Example**

```ts
import { Optional } from 'monocle-ts'

interface S {
  a: number | undefined | null
}

const optional = Optional.fromNullableProp<S>()('a')

const s1: S = { a: undefined }
const s2: S = { a: null }
const s3: S = { a: 1 }

assert.deepStrictEqual(optional.set(2)(s1), s1)
assert.deepStrictEqual(optional.set(2)(s2), s2)
assert.deepStrictEqual(optional.set(2)(s3), { a: 2 })
```

Added in v1.0.0

### fromOptionProp (static method)

Returns an `Optional` from an option (`Option<A>`) prop

**Signature**

```ts
static fromOptionProp<S>(): <P extends OptionPropertyNames<S>>(prop: P) => Optional<S, OptionPropertyType<S, P>>
```

**Example**

```ts
import { Optional } from 'monocle-ts'
import * as O from 'fp-ts/lib/Option'

interface S {
  a: O.Option<number>
}

const optional = Optional.fromOptionProp<S>()('a')
const s1: S = { a: O.none }
const s2: S = { a: O.some(1) }
assert.deepStrictEqual(optional.set(2)(s1), s1)
assert.deepStrictEqual(optional.set(2)(s2), { a: O.some(2) })
```

Added in v1.0.0

### modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S
```

Added in v1.0.0

### modifyOption (method)

**Signature**

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S>
```

Added in v1.0.0

### asTraversal (method)

view a `Optional` as a `Traversal`

**Signature**

```ts
asTraversal(): Traversal<S, A>
```

Added in v1.0.0

### asFold (method)

view an `Optional` as a `Fold`

**Signature**

```ts
asFold(): Fold<S, A>
```

Added in v1.0.0

### asSetter (method)

view an `Optional` as a `Setter`

**Signature**

```ts
asSetter(): Setter<S, A>
```

Added in v1.0.0

### compose (method)

compose a `Optional` with a `Optional`

**Signature**

```ts
compose<B>(ab: Optional<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeOptional (method)

Alias of `compose`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeTraversal (method)

compose an `Optional` with a `Traversal`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeFold (method)

compose an `Optional` with a `Fold`

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeSetter (method)

compose an `Optional` with a `Setter`

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeLens (method)

compose an `Optional` with a `Lens`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B>
```

Added in v1.0.0

### composePrism (method)

compose an `Optional` with a `Prism`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeIso (method)

compose an `Optional` with a `Iso`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeGetter (method)

compose an `Optional` with a `Getter`

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Optional"
```

Added in v1.0.0

## Prism (class)

Laws:

1. getOption(s).fold(s, reverseGet) = s
2. getOption(reverseGet(a)) = Some(a)

**Signature**

```ts
export declare class Prism<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly reverseGet: (a: A) => S)
}
```

Added in v1.0.0

### fromPredicate (static method)

**Signature**

```ts
static fromPredicate<S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
static fromPredicate<A>(predicate: Predicate<A>): Prism<A, A>
```

Added in v1.0.0

### some (static method)

**Signature**

```ts
static some<A>(): Prism<Option<A>, A>
```

Added in v1.0.0

### modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S
```

Added in v1.0.0

### modifyOption (method)

**Signature**

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S>
```

Added in v1.0.0

### set (method)

set the target of a `Prism` with a value

**Signature**

```ts
set(a: A): (s: S) => S
```

Added in v1.0.0

### asOptional (method)

view a `Prism` as a `Optional`

**Signature**

```ts
asOptional(): Optional<S, A>
```

Added in v1.0.0

### asTraversal (method)

view a `Prism` as a `Traversal`

**Signature**

```ts
asTraversal(): Traversal<S, A>
```

Added in v1.0.0

### asSetter (method)

view a `Prism` as a `Setter`

**Signature**

```ts
asSetter(): Setter<S, A>
```

Added in v1.0.0

### asFold (method)

view a `Prism` as a `Fold`

**Signature**

```ts
asFold(): Fold<S, A>
```

Added in v1.0.0

### compose (method)

compose a `Prism` with a `Prism`

**Signature**

```ts
compose<B>(ab: Prism<A, B>): Prism<S, B>
```

Added in v1.0.0

### composePrism (method)

Alias of `compose`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B>
```

Added in v1.0.0

### composeOptional (method)

compose a `Prism` with a `Optional`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeTraversal (method)

compose a `Prism` with a `Traversal`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeFold (method)

compose a `Prism` with a `Fold`

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeSetter (method)

compose a `Prism` with a `Setter`

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeIso (method)

compose a `Prism` with a `Iso`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Prism<S, B>
```

Added in v1.0.0

### composeLens (method)

compose a `Prism` with a `Lens`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B>
```

Added in v1.0.0

### composeGetter (method)

compose a `Prism` with a `Getter`

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Prism"
```

Added in v1.0.0

## Setter (class)

**Signature**

```ts
export declare class Setter<S, A> {
  constructor(readonly modify: (f: (a: A) => A) => (s: S) => S)
}
```

Added in v1.0.0

### set (method)

**Signature**

```ts
set(a: A): (s: S) => S
```

Added in v1.0.0

### compose (method)

compose a `Setter` with a `Setter`

**Signature**

```ts
compose<B>(ab: Setter<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeSetter (method)

Alias of `compose`

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeTraversal (method)

compose a `Setter` with a `Traversal`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeOptional (method)

compose a `Setter` with a `Optional`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeLens (method)

compose a `Setter` with a `Lens`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Setter<S, B>
```

Added in v1.0.0

### composePrism (method)

compose a `Setter` with a `Prism`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeIso (method)

compose a `Setter` with a `Iso`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Setter<S, B>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Setter"
```

Added in v1.0.0

## Traversal (class)

**Signature**

```ts
export declare class Traversal<S, A> {
  constructor(
    // Van Laarhoven representation
    readonly modifyF: ModifyF<S, A>
  )
}
```

Added in v1.0.0

### modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S
```

Added in v1.0.0

### set (method)

**Signature**

```ts
set(a: A): (s: S) => S
```

Added in v1.0.0

### filter (method)

focus the items matched by a `traversal` to those that match a predicate

**Signature**

```ts
filter<B extends A>(refinement: Refinement<A, B>): Traversal<S, B>
filter(predicate: Predicate<A>): Traversal<S, A>
```

**Example**

```ts
import { fromTraversable, Lens } from 'monocle-ts'
import { array } from 'fp-ts/lib/Array'

interface Person {
  name: string
  cool: boolean
}

const peopleTraversal = fromTraversable(array)<Person>()
const coolLens = Lens.fromProp<Person>()('cool')
const people = [
  { name: 'bill', cool: false },
  { name: 'jill', cool: true },
]

const actual = peopleTraversal
  .filter((p) => p.name === 'bill')
  .composeLens(coolLens)
  .set(true)(people)

assert.deepStrictEqual(actual, [
  { name: 'bill', cool: true },
  { name: 'jill', cool: true },
])
```

Added in v1.0.0

### asFold (method)

view a `Traversal` as a `Fold`

**Signature**

```ts
asFold(): Fold<S, A>
```

Added in v1.0.0

### asSetter (method)

view a `Traversal` as a `Setter`

**Signature**

```ts
asSetter(): Setter<S, A>
```

Added in v1.0.0

### compose (method)

compose a `Traversal` with a `Traversal`

**Signature**

```ts
compose<B>(ab: Traversal<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeTraversal (method)

Alias of `compose`

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeFold (method)

compose a `Traversal` with a `Fold`

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B>
```

Added in v1.0.0

### composeSetter (method)

compose a `Traversal` with a `Setter`

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B>
```

Added in v1.0.0

### composeOptional (method)

compose a `Traversal` with a `Optional`

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeLens (method)

compose a `Traversal` with a `Lens`

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composePrism (method)

compose a `Traversal` with a `Prism`

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeIso (method)

compose a `Traversal` with a `Iso`

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Traversal<S, B>
```

Added in v1.0.0

### composeGetter (method)

compose a `Traversal` with a `Getter`

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B>
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Traversal"
```

Added in v1.0.0

## fromFoldable

Create a `Fold` from a `Foldable`

**Signature**

```ts
export declare function fromFoldable<F extends URIS3>(F: Foldable3<F>): <U, L, A>() => Fold<Kind3<F, U, L, A>, A>
export declare function fromFoldable<F extends URIS2>(F: Foldable2<F>): <L, A>() => Fold<Kind2<F, L, A>, A>
export declare function fromFoldable<F extends URIS>(F: Foldable1<F>): <A>() => Fold<Kind<F, A>, A>
export declare function fromFoldable<F>(F: Foldable<F>): <A>() => Fold<HKT<F, A>, A>
```

Added in v1.0.0

## fromTraversable

Create a `Traversal` from a `Traversable`

**Signature**

```ts
export declare function fromTraversable<T extends URIS3>(
  T: Traversable3<T>
): <U, L, A>() => Traversal<Kind3<T, U, L, A>, A>
export declare function fromTraversable<T extends URIS2>(T: Traversable2<T>): <L, A>() => Traversal<Kind2<T, L, A>, A>
export declare function fromTraversable<T extends URIS>(T: Traversable1<T>): <A>() => Traversal<Kind<T, A>, A>
export declare function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
```

**Example**

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

const actual = composedTraversal.modify((text) => text.split('').reverse().join(''))(model)

assert.deepStrictEqual(actual, { tweets: [{ text: 'dlrow olleh' }, { text: 'raboof' }] })
```

Added in v1.0.0

# utils

## LensFromPath (interface)

**Signature**

```ts
export interface LensFromPath<S> {
  <
    K1 extends keyof S,
    K2 extends keyof S[K1],
    K3 extends keyof S[K1][K2],
    K4 extends keyof S[K1][K2][K3],
    K5 extends keyof S[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5]
  ): Lens<S, S[K1][K2][K3][K4][K5]>
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3]>(
    path: [K1, K2, K3, K4]
  ): Lens<S, S[K1][K2][K3][K4]>
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(path: [K1, K2, K3]): Lens<S, S[K1][K2][K3]>
  <K1 extends keyof S, K2 extends keyof S[K1]>(path: [K1, K2]): Lens<S, S[K1][K2]>
  <K1 extends keyof S>(path: [K1]): Lens<S, S[K1]>
}
```

Added in v1.3.0

## ModifyF (interface)

**Signature**

```ts
export interface ModifyF<S, A> {
  <F extends URIS3>(F: Applicative3<F>): <U, L>(f: (a: A) => Kind3<F, U, L, A>) => (s: S) => Kind3<F, U, L, S>
  <F extends URIS2>(F: Applicative2<F>): <L>(f: (a: A) => Kind2<F, L, A>) => (s: S) => Kind2<F, L, S>
  <F extends URIS2, L>(F: Applicative2C<F, L>): (f: (a: A) => Kind2<F, L, A>) => (s: S) => Kind2<F, L, S>
  <F extends URIS>(F: Applicative1<F>): (f: (a: A) => Kind<F, A>) => (s: S) => Kind<F, S>
  <F>(F: Applicative<F>): (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>
}
```

Added in v1.0.0

## OptionalFromPath (interface)

**Signature**

```ts
export interface OptionalFromPath<S> {
  <
    K1 extends keyof S,
    K2 extends keyof NonNullable<S[K1]>,
    K3 extends keyof NonNullable<NonNullable<S[K1]>[K2]>,
    K4 extends keyof NonNullable<NonNullable<NonNullable<S[K1]>[K2]>[K3]>,
    K5 extends keyof NonNullable<NonNullable<NonNullable<S[K1]>[K2]>[K3]>[K4]
  >(
    path: [K1, K2, K3, K4, K5]
  ): Optional<S, NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<S[K1]>[K2]>[K3]>[K4]>[K5]>>

  <
    K1 extends keyof S,
    K2 extends keyof NonNullable<S[K1]>,
    K3 extends keyof NonNullable<NonNullable<S[K1]>[K2]>,
    K4 extends keyof NonNullable<NonNullable<NonNullable<S[K1]>[K2]>[K3]>
  >(
    path: [K1, K2, K3, K4]
  ): Optional<S, NonNullable<NonNullable<NonNullable<NonNullable<S[K1]>[K2]>[K3]>[K4]>>

  <K1 extends keyof S, K2 extends keyof NonNullable<S[K1]>, K3 extends keyof NonNullable<NonNullable<S[K1]>[K2]>>(
    path: [K1, K2, K3]
  ): Optional<S, NonNullable<NonNullable<NonNullable<S[K1]>[K2]>[K3]>>

  <K1 extends keyof S, K2 extends keyof NonNullable<S[K1]>>(path: [K1, K2]): Optional<
    S,
    NonNullable<NonNullable<S[K1]>[K2]>
  >

  <K1 extends keyof S>(path: [K1]): Optional<S, NonNullable<S[K1]>>
}
```

Added in v2.1.0
