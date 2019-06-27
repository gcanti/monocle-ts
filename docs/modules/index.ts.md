---
title: index.ts
nav_order: 5
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [LensFromPath (interface)](#lensfrompath-interface)
- [ModifyF (interface)](#modifyf-interface)
- [At (class)](#at-class)
  - [fromIso (method)](#fromiso-method)
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
- [Index (class)](#index-class)
- [fromAt (static method)](#fromat-static-method)
  - [fromIso (method)](#fromiso-method-1)
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
- [Optional (class)](#optional-class)
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
- [Prism (class)](#prism-class)
- [fromPredicate (static method)](#frompredicate-static-method)
- [~~fromRefinement~~ (static method)](#fromrefinement-static-method)
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
- [Setter (class)](#setter-class)
  - [set (method)](#set-method-1)
  - [compose (method)](#compose-method-6)
  - [composeSetter (method)](#composesetter-method-4)
  - [composeTraversal (method)](#composetraversal-method-6)
  - [composeOptional (method)](#composeoptional-method-6)
  - [composeLens (method)](#composelens-method-6)
  - [composePrism (method)](#composeprism-method-6)
  - [composeIso (method)](#composeiso-method-6)
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
- [fromFoldable (function)](#fromfoldable-function)
- [fromTraversable (function)](#fromtraversable-function)

---

# LensFromPath (interface)

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

# ModifyF (interface)

**Signature**

```ts
export interface ModifyF<S, A> {
  // tslint:disable-next-line: deprecation
  <F extends URIS3>(F: Applicative3<F>): <U, L>(f: (a: A) => Type3<F, U, L, A>) => (s: S) => Type3<F, U, L, S>
  // tslint:disable-next-line: deprecation
  <F extends URIS3, U, L>(F: Applicative3C<F, U, L>): (f: (a: A) => Type3<F, U, L, A>) => (s: S) => Type3<F, U, L, S>
  // tslint:disable-next-line: deprecation
  <F extends URIS2>(F: Applicative2<F>): <L>(f: (a: A) => Type2<F, L, A>) => (s: S) => Type2<F, L, S>
  // tslint:disable-next-line: deprecation
  <F extends URIS2, L>(F: Applicative2C<F, L>): (f: (a: A) => Type2<F, L, A>) => (s: S) => Type2<F, L, S>
  // tslint:disable-next-line: deprecation
  <F extends URIS>(F: Applicative1<F>): (f: (a: A) => Type<F, A>) => (s: S) => Type<F, S>
  <F>(F: Applicative<F>): (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>
}
```

# At (class)

**Signature**

```ts
export class At<S, I, A> {
  constructor(readonly at: (i: I) => Lens<S, A>) { ... }
  ...
}
```

## fromIso (method)

lift an instance of `At` using an `Iso`

**Signature**

```ts
fromIso<T>(iso: Iso<T, S>): At<T, I, A> { ... }
```

# Fold (class)

**Signature**

```ts
export class Fold<S, A> {
  constructor(readonly foldMap: <M>(M: Monoid<M>) => (f: (a: A) => M) => (s: S) => M) { ... }
  ...
}
```

## compose (method)

compose a Fold with a Fold

**Signature**

```ts
compose<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeFold (method)

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeGetter (method)

compose a Fold with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

## composeTraversal (method)

compose a Fold with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> { ... }
```

## composeOptional (method)

compose a Fold with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B> { ... }
```

## composeLens (method)

compose a Fold with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Fold<S, B> { ... }
```

## composePrism (method)

compose a Fold with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B> { ... }
```

## composeIso (method)

compose a Fold with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Fold<S, B> { ... }
```

## find (method)

find the first target of a Fold matching the predicate

**Signature**

```ts
find<B extends A>(p: Refinement<A, B>): (s: S) => Option<B>
find(p: Predicate<A>): (s: S) => Option<A> { ... }
```

## headOption (method)

get the first target of a Fold

**Signature**

```ts
headOption(s: S): Option<A> { ... }
```

# Getter (class)

**Signature**

```ts
export class Getter<S, A> {
  constructor(readonly get: (s: S) => A) { ... }
  ...
}
```

## asFold (method)

view a Getter as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## compose (method)

compose a Getter with a Getter

**Signature**

```ts
compose<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeGetter (method)

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeFold (method)

compose a Getter with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeLens (method)

compose a Getter with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Getter<S, B> { ... }
```

## composeIso (method)

compose a Getter with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Getter<S, B> { ... }
```

## composeTraversal (method)

compose a Getter with a Optional

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> { ... }
```

## composeOptional (method)

compose a Getter with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B> { ... }
```

## composePrism (method)

compose a Getter with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B> { ... }
```

# Index (class)

**Signature**

```ts
export class Index<S, I, A> {
  constructor(readonly index: (i: I) => Optional<S, A>) { ... }
  ...
}
```

# fromAt (static method)

**Signature**

```ts
static fromAt<T, J, B>(at: At<T, J, Option<B>>): Index<T, J, B> { ... }
```

## fromIso (method)

lift an instance of `Index` using an `Iso`

**Signature**

```ts
fromIso<T>(iso: Iso<T, S>): Index<T, I, A> { ... }
```

# Iso (class)

**Signature**

```ts
export class Iso<S, A> {
  constructor(readonly get: (s: S) => A, readonly reverseGet: (a: A) => S) { ... }
  ...
}
```

## reverse (method)

reverse the `Iso`: the source becomes the target and the target becomes the source

**Signature**

```ts
reverse(): Iso<A, S> { ... }
```

## modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## asLens (method)

view an Iso as a Lens

**Signature**

```ts
asLens(): Lens<S, A> { ... }
```

## asPrism (method)

view an Iso as a Prism

**Signature**

```ts
asPrism(): Prism<S, A> { ... }
```

## asOptional (method)

view an Iso as a Optional

**Signature**

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal (method)

view an Iso as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asFold (method)

view an Iso as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## asGetter (method)

view an Iso as a Getter

**Signature**

```ts
asGetter(): Getter<S, A> { ... }
```

## asSetter (method)

view an Iso as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## compose (method)

compose an Iso with an Iso

**Signature**

```ts
compose<B>(ab: Iso<A, B>): Iso<S, B> { ... }
```

## composeIso (method)

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Iso<S, B> { ... }
```

## composeLens (method)

compose an Iso with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composePrism (method)

compose an Iso with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composeOptional (method)

compose an Iso with an Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal (method)

compose an Iso with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold (method)

compose an Iso with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeGetter (method)

compose an Iso with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeSetter (method)

compose an Iso with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

# Lens (class)

**Signature**

```ts
export class Lens<S, A> {
  constructor(readonly get: (s: S) => A, readonly set: (a: A) => (s: S) => S) { ... }
  ...
}
```

# fromPath (static method)

**Signature**

```ts
static fromPath<S>(): LensFromPath<S>
static fromPath<
    S,
    K1 extends keyof S,
    K2 extends keyof S[K1],
    K3 extends keyof S[K1][K2],
    K4 extends keyof S[K1][K2][K3],
    K5 extends keyof S[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5]): Lens<S, S[K1][K2][K3][K4][K5]>
static fromPath<
    S,
    K1 extends keyof S,
    K2 extends keyof S[K1],
    K3 extends keyof S[K1][K2],
    K4 extends keyof S[K1][K2][K3]
  >(path: [K1, K2, K3, K4]): Lens<S, S[K1][K2][K3][K4]>
static fromPath<S, K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(
    path: [K1, K2, K3]
  ): Lens<S, S[K1][K2][K3]>
static fromPath<S, K1 extends keyof S, K2 extends keyof S[K1]>(path: [K1, K2]): Lens<S, S[K1][K2]>
static fromPath<S, K1 extends keyof S>(path: [K1]): Lens<S, S[K1]> { ... }
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

# fromProp (static method)

generate a lens from a type and a prop

**Signature**

```ts
static fromProp<S>(): <P extends keyof S>(prop: P) => Lens<S, S[P]>
static fromProp<S, P extends keyof S>(prop: P): Lens<S, S[P]> { ... }
```

**Example**

```ts
import { Lens } from 'monocle-ts'

type Person = {
  name: string
  age: number
}

const age = Lens.fromProp<Person>()('age')
// or (deprecated)
// const age = Lens.fromProp<Person, 'age'>('age')

const person: Person = { name: 'Giulio', age: 43 }

assert.strictEqual(age.get(person), 43)
assert.deepStrictEqual(age.set(44)(person), { name: 'Giulio', age: 44 })
```

# fromProps (static method)

generate a lens from a type and an array of props

**Signature**

```ts
static fromProps<S>(): <P extends keyof S>(props: Array<P>) => Lens<S, { [K in P]: S[K] }> { ... }
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

# fromNullableProp (static method)

generate a lens from a type and a prop whose type is nullable

**Signature**

```ts
static fromNullableProp<S>(): <A extends S[K], K extends keyof S>(k: K, defaultValue: A) => Lens<S, NonNullable<S[K]>>
static fromNullableProp<S, A extends S[K], K extends keyof S>(k: K, defaultValue: A): Lens<S, NonNullable<S[K]>> { ... }
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

## modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## asOptional (method)

view a Lens as a Optional

**Signature**

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal (method)

view a Lens as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asSetter (method)

view a Lens as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## asGetter (method)

view a Lens as a Getter

**Signature**

```ts
asGetter(): Getter<S, A> { ... }
```

## asFold (method)

view a Lens as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## compose (method)

compose a Lens with a Lens

**Signature**

```ts
compose<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composeLens (method)

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composeGetter (method)

compose a Lens with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeFold (method)

compose a Lens with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeOptional (method)

compose a Lens with an Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal (method)

compose a Lens with an Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeSetter (method)

compose a Lens with an Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeIso (method)

compose a Lens with an Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Lens<S, B> { ... }
```

## composePrism (method)

compose a Lens with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B> { ... }
```

# Optional (class)

**Signature**

```ts
export class Optional<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly set: (a: A) => (s: S) => S) { ... }
  ...
}
```

# fromNullableProp (static method)

**Signature**

```ts
static fromNullableProp<S>(): <K extends keyof S>(k: K) => Optional<S, NonNullable<S[K]>>
static fromNullableProp<S, A extends S[K], K extends keyof S>(k: K): Optional<S, NonNullable<S[K]>> { ... }
```

**Example**

```ts
import { Optional, Lens } from 'monocle-ts'

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

# fromOptionProp (static method)

**Signature**

```ts
static fromOptionProp<S>(): <P extends OptionPropertyNames<S>>(prop: P) => Optional<S, OptionPropertyType<S, P>>
static fromOptionProp<S>(prop: OptionPropertyNames<S>): Optional<S, OptionPropertyType<S, typeof prop>> { ... }
```

**Example**

```ts
import { Optional, Lens } from 'monocle-ts'
import { Option } from 'fp-ts/lib/Option'

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
export const numberFromResponse = info
  .compose(employment)
  .compose(phone)
  .composeLens(number)
```

## modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## modifyOption (method)

**Signature**

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S> { ... }
```

## asTraversal (method)

view a Optional as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asFold (method)

view an Optional as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## asSetter (method)

view an Optional as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## compose (method)

compose a Optional with a Optional

**Signature**

```ts
compose<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeOptional (method)

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal (method)

compose an Optional with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold (method)

compose an Optional with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter (method)

compose an Optional with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeLens (method)

compose an Optional with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B> { ... }
```

## composePrism (method)

compose an Optional with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B> { ... }
```

## composeIso (method)

compose an Optional with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Optional<S, B> { ... }
```

## composeGetter (method)

compose an Optional with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# Prism (class)

**Signature**

```ts
export class Prism<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly reverseGet: (a: A) => S) { ... }
  ...
}
```

# fromPredicate (static method)

**Signature**

```ts
static fromPredicate<S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
static fromPredicate<A>(predicate: Predicate<A>): Prism<A, A> { ... }
```

# ~~fromRefinement~~ (static method)

Use `fromPredicate` instead

**Signature**

```ts
static fromRefinement<S, A extends S>(refinement: Refinement<S, A>): Prism<S, A> { ... }
```

# some (static method)

**Signature**

```ts
static some<A>(): Prism<Option<A>, A> { ... }
```

## modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## modifyOption (method)

**Signature**

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S> { ... }
```

## set (method)

set the target of a Prism with a value

**Signature**

```ts
set(a: A): (s: S) => S { ... }
```

## asOptional (method)

view a Prism as a Optional

**Signature**

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal (method)

view a Prism as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asSetter (method)

view a Prism as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## asFold (method)

view a Prism as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## compose (method)

compose a Prism with a Prism

**Signature**

```ts
compose<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composePrism (method)

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composeOptional (method)

compose a Prism with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal (method)

compose a Prism with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold (method)

compose a Prism with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter (method)

compose a Prism with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeIso (method)

compose a Prism with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Prism<S, B> { ... }
```

## composeLens (method)

compose a Prism with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B> { ... }
```

## composeGetter (method)

compose a Prism with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# Setter (class)

**Signature**

```ts
export class Setter<S, A> {
  constructor(readonly modify: (f: (a: A) => A) => (s: S) => S) { ... }
  ...
}
```

## set (method)

**Signature**

```ts
set(a: A): (s: S) => S { ... }
```

## compose (method)

compose a Setter with a Setter

**Signature**

```ts
compose<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeSetter (method)

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeTraversal (method)

compose a Setter with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Setter<S, B> { ... }
```

## composeOptional (method)

compose a Setter with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Setter<S, B> { ... }
```

## composeLens (method)

compose a Setter with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Setter<S, B> { ... }
```

## composePrism (method)

compose a Setter with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Setter<S, B> { ... }
```

## composeIso (method)

compose a Setter with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Setter<S, B> { ... }
```

# Traversal (class)

**Signature**

```ts
export class Traversal<S, A> {
  constructor(
    // Van Laarhoven representation
    readonly modifyF: ModifyF<S, A>
  ) { ... }
  ...
}
```

## modify (method)

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## set (method)

**Signature**

```ts
set(a: A): (s: S) => S { ... }
```

## filter (method)

focus the items matched by a traversal to those that match a predicate

**Signature**

```ts
filter<B extends A>(refinement: Refinement<A, B>): Traversal<S, B>
filter(predicate: Predicate<A>): Traversal<S, A> { ... }
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
const people = [{ name: 'bill', cool: false }, { name: 'jill', cool: true }]

const actual = peopleTraversal
  .filter(p => p.name === 'bill')
  .composeLens(coolLens)
  .set(true)(people)

assert.deepStrictEqual(actual, [{ name: 'bill', cool: true }, { name: 'jill', cool: true }])
```

## asFold (method)

view a Traversal as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## asSetter (method)

view a Traversal as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## compose (method)

compose a Traversal with a Traversal

**Signature**

```ts
compose<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeTraversal (method)

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold (method)

compose a Traversal with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter (method)

compose a Traversal with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeOptional (method)

compose a Traversal with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Traversal<S, B> { ... }
```

## composeLens (method)

compose a Traversal with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Traversal<S, B> { ... }
```

## composePrism (method)

compose a Traversal with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Traversal<S, B> { ... }
```

## composeIso (method)

compose a Traversal with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Traversal<S, B> { ... }
```

## composeGetter (method)

compose a Traversal with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# fromFoldable (function)

create a Fold from a Foldable

**Signature**

```ts
export function fromFoldable<F extends URIS3>(F: Foldable3<F>): <U, L, A>() => Fold<Type3<F, U, L, A>, A>
export function fromFoldable<F extends URIS2>(F: Foldable2<F>): <L, A>() => Fold<Type2<F, L, A>, A>
export function fromFoldable<F extends URIS>(F: Foldable1<F>): <A>() => Fold<Type<F, A>, A>
export function fromFoldable<F>(F: Foldable<F>): <A>() => Fold<HKT<F, A>, A> { ... }
```

# fromTraversable (function)

create a Traversal from a Traversable

**Signature**

```ts
export function fromTraversable<T extends URIS3>(T: Traversable3<T>): <U, L, A>() => Traversal<Type3<T, U, L, A>, A>
export function fromTraversable<T extends URIS2>(T: Traversable2<T>): <L, A>() => Traversal<Type2<T, L, A>, A>
export function fromTraversable<T extends URIS>(T: Traversable1<T>): <A>() => Traversal<Type<T, A>, A>
export function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A> { ... }
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

const actual = composedTraversal.modify(text =>
  text
    .split('')
    .reverse()
    .join('')
)(model)

assert.deepStrictEqual(actual, { tweets: [{ text: 'dlrow olleh' }, { text: 'raboof' }] })
```
