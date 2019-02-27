---
title: index.ts
nav_order: 4
---

Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [LensFromPath](#lensfrompath)
- [ModifyF](#modifyf)
- [At](#at)
  - [fromIso](#fromiso)
- [Fold](#fold)
  - [compose](#compose)
  - [composeFold](#composefold)
  - [composeGetter](#composegetter)
  - [composeTraversal](#composetraversal)
  - [composeOptional](#composeoptional)
  - [composeLens](#composelens)
  - [composePrism](#composeprism)
  - [composeIso](#composeiso)
  - [find](#find)
  - [headOption](#headoption)
- [Getter](#getter)
  - [asFold](#asfold)
  - [compose](#compose-1)
  - [composeGetter](#composegetter-1)
  - [composeFold](#composefold-1)
  - [composeLens](#composelens-1)
  - [composeIso](#composeiso-1)
  - [composeTraversal](#composetraversal-1)
  - [composeOptional](#composeoptional-1)
  - [composePrism](#composeprism-1)
- [Index](#index)
  - [fromAt](#fromat)
  - [fromIso](#fromiso-1)
- [Iso](#iso)
  - [reverse](#reverse)
  - [modify](#modify)
  - [asLens](#aslens)
  - [asPrism](#asprism)
  - [asOptional](#asoptional)
  - [asTraversal](#astraversal)
  - [asFold](#asfold-1)
  - [asGetter](#asgetter)
  - [asSetter](#assetter)
  - [compose](#compose-2)
  - [composeIso](#composeiso-2)
  - [composeLens](#composelens-2)
  - [composePrism](#composeprism-2)
  - [composeOptional](#composeoptional-2)
  - [composeTraversal](#composetraversal-2)
  - [composeFold](#composefold-2)
  - [composeGetter](#composegetter-2)
  - [composeSetter](#composesetter)
- [Lens](#lens)
  - [fromPath](#frompath)
  - [fromProp](#fromprop)
  - [fromProps](#fromprops)
  - [fromNullableProp](#fromnullableprop)
  - [modify](#modify-1)
  - [asOptional](#asoptional-1)
  - [asTraversal](#astraversal-1)
  - [asSetter](#assetter-1)
  - [asGetter](#asgetter-1)
  - [asFold](#asfold-2)
  - [compose](#compose-3)
  - [composeLens](#composelens-3)
  - [composeGetter](#composegetter-3)
  - [composeFold](#composefold-3)
  - [composeOptional](#composeoptional-3)
  - [composeTraversal](#composetraversal-3)
  - [composeSetter](#composesetter-1)
  - [composeIso](#composeiso-3)
  - [composePrism](#composeprism-3)
- [Optional](#optional)
  - [fromNullableProp](#fromnullableprop-1)
  - [fromOptionProp](#fromoptionprop)
  - [modify](#modify-2)
  - [modifyOption](#modifyoption)
  - [asTraversal](#astraversal-2)
  - [asFold](#asfold-3)
  - [asSetter](#assetter-2)
  - [compose](#compose-4)
  - [composeOptional](#composeoptional-4)
  - [composeTraversal](#composetraversal-4)
  - [composeFold](#composefold-4)
  - [composeSetter](#composesetter-2)
  - [composeLens](#composelens-4)
  - [composePrism](#composeprism-4)
  - [composeIso](#composeiso-4)
  - [composeGetter](#composegetter-4)
- [Prism](#prism)
  - [fromPredicate](#frompredicate)
  - [~~fromRefinement~~ (deprecated)](#fromrefinement-deprecated)
  - [some](#some)
  - [modify](#modify-3)
  - [modifyOption](#modifyoption-1)
  - [set](#set)
  - [asOptional](#asoptional-2)
  - [asTraversal](#astraversal-3)
  - [asSetter](#assetter-3)
  - [asFold](#asfold-4)
  - [compose](#compose-5)
  - [composePrism](#composeprism-5)
  - [composeOptional](#composeoptional-5)
  - [composeTraversal](#composetraversal-5)
  - [composeFold](#composefold-5)
  - [composeSetter](#composesetter-3)
  - [composeIso](#composeiso-5)
  - [composeLens](#composelens-5)
  - [composeGetter](#composegetter-5)
- [Setter](#setter)
  - [set](#set-1)
  - [compose](#compose-6)
  - [composeSetter](#composesetter-4)
  - [composeTraversal](#composetraversal-6)
  - [composeOptional](#composeoptional-6)
  - [composeLens](#composelens-6)
  - [composePrism](#composeprism-6)
  - [composeIso](#composeiso-6)
- [Traversal](#traversal)
  - [modify](#modify-4)
  - [set](#set-2)
  - [filter](#filter)
  - [asFold](#asfold-5)
  - [asSetter](#assetter-4)
  - [compose](#compose-7)
  - [composeTraversal](#composetraversal-7)
  - [composeFold](#composefold-6)
  - [composeSetter](#composesetter-5)
  - [composeOptional](#composeoptional-7)
  - [composeLens](#composelens-7)
  - [composePrism](#composeprism-7)
  - [composeIso](#composeiso-7)
  - [composeGetter](#composegetter-6)
- [fromFoldable](#fromfoldable)
- [fromTraversable](#fromtraversable)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# LensFromPath

**Signature** (interface)

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

# ModifyF

**Signature** (interface)

```ts
export interface ModifyF<S, A> {
  <F extends URIS3>(F: Applicative3<F>): <U, L>(f: (a: A) => Type3<F, U, L, A>) => (s: S) => Type3<F, U, L, S>
  <F extends URIS3, U, L>(F: Applicative3C<F, U, L>): (f: (a: A) => Type3<F, U, L, A>) => (s: S) => Type3<F, U, L, S>
  <F extends URIS2>(F: Applicative2<F>): <L>(f: (a: A) => Type2<F, L, A>) => (s: S) => Type2<F, L, S>
  <F extends URIS2, L>(F: Applicative2C<F, L>): (f: (a: A) => Type2<F, L, A>) => (s: S) => Type2<F, L, S>
  <F extends URIS>(F: Applicative1<F>): (f: (a: A) => Type<F, A>) => (s: S) => Type<F, S>
  <F>(F: Applicative<F>): (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>
}
```

# At

**Signature** (class)

```ts
export class At<S, I, A> {
  constructor(readonly at: (i: I) => Lens<S, A>) {}
  ...
}
```

## fromIso

lift an instance of `At` using an `Iso`

**Signature** (method)

```ts
fromIso<T>(iso: Iso<T, S>): At<T, I, A> { ... }
```

# Fold

**Signature** (class)

```ts
export class Fold<S, A> {
  constructor(readonly foldMap: <M>(M: Monoid<M>) => (f: (a: A) => M) => (s: S) => M) {
    this.getAll = foldMap(getArrayMonoid<A>())(a => [a])
    this.exist = foldMap(monoidAny)
    this.all = foldMap(monoidAll)
    this.foldMapFirst = foldMap(getFirstMonoid())
  }
  ...
}
```

## compose

compose a Fold with a Fold

**Signature** (method)

```ts
compose<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeFold

**Signature** (method)

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeGetter

compose a Fold with a Getter

**Signature** (method)

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

## composeTraversal

compose a Fold with a Traversal

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> { ... }
```

## composeOptional

compose a Fold with a Optional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B> { ... }
```

## composeLens

compose a Fold with a Lens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Fold<S, B> { ... }
```

## composePrism

compose a Fold with a Prism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B> { ... }
```

## composeIso

compose a Fold with a Iso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Fold<S, B> { ... }
```

## find

find the first target of a Fold matching the predicate

**Signature** (method)

```ts
find<B extends A>(p: Refinement<A, B>): (s: S) => Option<B>
find(p: Predicate<A>): (s: S) => Option<A>
find(p: Predicate<A>): (s: S) => Option<A> { ... }
```

## headOption

get the first target of a Fold

**Signature** (method)

```ts
headOption(s: S): Option<A> { ... }
```

# Getter

**Signature** (class)

```ts
export class Getter<S, A> {
  constructor(readonly get: (s: S) => A) {}
  ...
}
```

## asFold

view a Getter as a Fold

**Signature** (method)

```ts
asFold(): Fold<S, A> { ... }
```

## compose

compose a Getter with a Getter

**Signature** (method)

```ts
compose<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeGetter

**Signature** (method)

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeFold

compose a Getter with a Fold

**Signature** (method)

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeLens

compose a Getter with a Lens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Getter<S, B> { ... }
```

## composeIso

compose a Getter with a Iso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Getter<S, B> { ... }
```

## composeTraversal

compose a Getter with a Optional

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> { ... }
```

## composeOptional

compose a Getter with a Optional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B> { ... }
```

## composePrism

compose a Getter with a Prism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B> { ... }
```

# Index

**Signature** (class)

```ts
export class Index<S, I, A> {
  constructor(readonly index: (i: I) => Optional<S, A>) {}
  ...
}
```

## fromAt

**Signature** (method)

```ts
static fromAt<T, J, B>(at: At<T, J, Option<B>>): Index<T, J, B> { ... }
```

## fromIso

lift an instance of `Index` using an `Iso`

**Signature** (method)

```ts
fromIso<T>(iso: Iso<T, S>): Index<T, I, A> { ... }
```

# Iso

**Signature** (class)

```ts
export class Iso<S, A> {
  constructor(readonly get: (s: S) => A, readonly reverseGet: (a: A) => S) {}
  ...
}
```

## reverse

reverse the `Iso`: the source becomes the target and the target becomes the source

**Signature** (method)

```ts
reverse(): Iso<A, S> { ... }
```

## modify

**Signature** (method)

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## asLens

view an Iso as a Lens

**Signature** (method)

```ts
asLens(): Lens<S, A> { ... }
```

## asPrism

view an Iso as a Prism

**Signature** (method)

```ts
asPrism(): Prism<S, A> { ... }
```

## asOptional

view an Iso as a Optional

**Signature** (method)

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal

view an Iso as a Traversal

**Signature** (method)

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asFold

view an Iso as a Fold

**Signature** (method)

```ts
asFold(): Fold<S, A> { ... }
```

## asGetter

view an Iso as a Getter

**Signature** (method)

```ts
asGetter(): Getter<S, A> { ... }
```

## asSetter

view an Iso as a Setter

**Signature** (method)

```ts
asSetter(): Setter<S, A> { ... }
```

## compose

compose an Iso with an Iso

**Signature** (method)

```ts
compose<B>(ab: Iso<A, B>): Iso<S, B> { ... }
```

## composeIso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Iso<S, B> { ... }
```

## composeLens

compose an Iso with a Lens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composePrism

compose an Iso with a Prism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composeOptional

compose an Iso with an Optional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose an Iso with a Traversal

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose an Iso with a Fold

**Signature** (method)

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeGetter

compose an Iso with a Getter

**Signature** (method)

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeSetter

compose an Iso with a Setter

**Signature** (method)

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

# Lens

**Signature** (class)

```ts
export class Lens<S, A> {
  constructor(readonly get: (s: S) => A, readonly set: (a: A) => (s: S) => S) {}
  ...
}
```

## fromPath

**Signature** (method)

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
static fromPath<S, K1 extends keyof S>(path: [K1]): Lens<S, S[K1]>
static fromPath(): any { ... }
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

console.log(city.get(person)) // Milan
console.log(city.set('London')(person)) // { name: 'Giulio', age: 43, address: { city: 'London' } }
```

## fromProp

generate a lens from a type and a prop

**Signature** (method)

```ts
static fromProp<S>(): <P extends keyof S>(prop: P) => Lens<S, S[P]>
static fromProp<S, P extends keyof S>(prop: P): Lens<S, S[P]>
static fromProp(): any { ... }
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

console.log(age.get(person)) // 43
console.log(age.set(44)(person)) // { name: 'Giulio', age: 44 }
```

## fromProps

generate a lens from a type and an array of props

**Signature** (method)

```ts
static fromProps<S>(): <P extends keyof S>(props: Array<P>) => Lens<S, { ... }
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

console.log(lens.get(person)) // { name: 'Giulio', age: 44 }
console.log(lens.set({ name: 'Guido', age: 47 })(person)) // { name: 'Guido', age: 47, rememberMe: true }
```

## fromNullableProp

generate a lens from a type and a prop whose type is nullable

**Signature** (method)

```ts
static fromNullableProp<S>(): <A extends S[K], K extends keyof S>(k: K, defaultValue: A) => Lens<S, NonNullable<S[K]>>
static fromNullableProp<S, A extends S[K], K extends keyof S>(k: K, defaultValue: A): Lens<S, NonNullable<S[K]>>
static fromNullableProp(): any { ... }
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

console.log(lens.set(1)({})) // { inner: { value: 1, foo: 'foo' } }
console.log(lens.get({})) // 0
console.log(lens.set(1)({ inner: { value: 1, foo: 'bar' } })) // { inner: { value: 1, foo: 'bar' } }
console.log(lens.get({ inner: { value: 1, foo: 'bar' } })) // 1
```

## modify

**Signature** (method)

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## asOptional

view a Lens as a Optional

**Signature** (method)

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal

view a Lens as a Traversal

**Signature** (method)

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asSetter

view a Lens as a Setter

**Signature** (method)

```ts
asSetter(): Setter<S, A> { ... }
```

## asGetter

view a Lens as a Getter

**Signature** (method)

```ts
asGetter(): Getter<S, A> { ... }
```

## asFold

view a Lens as a Fold

**Signature** (method)

```ts
asFold(): Fold<S, A> { ... }
```

## compose

compose a Lens with a Lens

**Signature** (method)

```ts
compose<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composeLens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composeGetter

compose a Lens with a Getter

**Signature** (method)

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeFold

compose a Lens with a Fold

**Signature** (method)

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeOptional

compose a Lens with an Optional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose a Lens with an Traversal

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeSetter

compose a Lens with an Setter

**Signature** (method)

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeIso

compose a Lens with an Iso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Lens<S, B> { ... }
```

## composePrism

compose a Lens with a Prism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B> { ... }
```

# Optional

**Signature** (class)

```ts
export class Optional<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly set: (a: A) => (s: S) => S) {}
  ...
}
```

## fromNullableProp

**Signature** (method)

```ts
static fromNullableProp<S>(): <K extends keyof S>(k: K) => Optional<S, NonNullable<S[K]>>
static fromNullableProp<S, A extends S[K], K extends keyof S>(k: K): Optional<S, NonNullable<S[K]>>
static fromNullableProp(): any { ... }
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

## fromOptionProp

**Signature** (method)

```ts
static fromOptionProp<S>(): <P extends OptionPropertyNames<S>>(prop: P) => Optional<S, OptionPropertyType<S, P>>
static fromOptionProp<S>(prop: OptionPropertyNames<S>): Optional<S, OptionPropertyType<S, typeof prop>>
static fromOptionProp(): any { ... }
```

**Example**

```ts
import { Optional, Lens } from 'monocle-ts'

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

## modify

**Signature** (method)

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## modifyOption

**Signature** (method)

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S> { ... }
```

## asTraversal

view a Optional as a Traversal

**Signature** (method)

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asFold

view an Optional as a Fold

**Signature** (method)

```ts
asFold(): Fold<S, A> { ... }
```

## asSetter

view an Optional as a Setter

**Signature** (method)

```ts
asSetter(): Setter<S, A> { ... }
```

## compose

compose a Optional with a Optional

**Signature** (method)

```ts
compose<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeOptional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose an Optional with a Traversal

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose an Optional with a Fold

**Signature** (method)

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter

compose an Optional with a Setter

**Signature** (method)

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeLens

compose an Optional with a Lens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B> { ... }
```

## composePrism

compose an Optional with a Prism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B> { ... }
```

## composeIso

compose an Optional with a Iso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Optional<S, B> { ... }
```

## composeGetter

compose an Optional with a Getter

**Signature** (method)

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# Prism

**Signature** (class)

```ts
export class Prism<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly reverseGet: (a: A) => S) {}
  ...
}
```

## fromPredicate

**Signature** (method)

```ts
static fromPredicate<S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
static fromPredicate<A>(predicate: Predicate<A>): Prism<A, A>
static fromPredicate<A>(predicate: Predicate<A>): Prism<A, A> { ... }
```

## ~~fromRefinement~~ (deprecated)

Use `fromPredicate` instead

**Signature** (method)

```ts
static fromRefinement<S, A extends S>(refinement: Refinement<S, A>): Prism<S, A> { ... }
```

## some

**Signature** (method)

```ts
static some<A>(): Prism<Option<A>, A> { ... }
```

## modify

**Signature** (method)

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## modifyOption

**Signature** (method)

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S> { ... }
```

## set

set the target of a Prism with a value

**Signature** (method)

```ts
set(a: A): (s: S) => S { ... }
```

## asOptional

view a Prism as a Optional

**Signature** (method)

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal

view a Prism as a Traversal

**Signature** (method)

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asSetter

view a Prism as a Setter

**Signature** (method)

```ts
asSetter(): Setter<S, A> { ... }
```

## asFold

view a Prism as a Fold

**Signature** (method)

```ts
asFold(): Fold<S, A> { ... }
```

## compose

compose a Prism with a Prism

**Signature** (method)

```ts
compose<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composePrism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composeOptional

compose a Prism with a Optional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose a Prism with a Traversal

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose a Prism with a Fold

**Signature** (method)

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter

compose a Prism with a Setter

**Signature** (method)

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeIso

compose a Prism with a Iso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Prism<S, B> { ... }
```

## composeLens

compose a Prism with a Lens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B> { ... }
```

## composeGetter

compose a Prism with a Getter

**Signature** (method)

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# Setter

**Signature** (class)

```ts
export class Setter<S, A> {
  constructor(readonly modify: (f: (a: A) => A) => (s: S) => S) {}
  ...
}
```

## set

**Signature** (method)

```ts
set(a: A): (s: S) => S { ... }
```

## compose

compose a Setter with a Setter

**Signature** (method)

```ts
compose<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeSetter

**Signature** (method)

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeTraversal

compose a Setter with a Traversal

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Setter<S, B> { ... }
```

## composeOptional

compose a Setter with a Optional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Setter<S, B> { ... }
```

## composeLens

compose a Setter with a Lens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Setter<S, B> { ... }
```

## composePrism

compose a Setter with a Prism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Setter<S, B> { ... }
```

## composeIso

compose a Setter with a Iso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Setter<S, B> { ... }
```

# Traversal

**Signature** (class)

```ts
export class Traversal<S, A> {
  constructor(
    // Van Laarhoven representation
    readonly modifyF: ModifyF<S, A>
  ) {}
  ...
}
```

## modify

**Signature** (method)

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## set

**Signature** (method)

```ts
set(a: A): (s: S) => S { ... }
```

## filter

focus the items matched by a traversal to those that match a predicate

**Signature** (method)

```ts
filter<B extends A>(refinement: Refinement<A, B>): Traversal<S, B>
filter(predicate: Predicate<A>): Traversal<S, A>
filter(predicate: Predicate<A>): Traversal<S, A> { ... }
```

**Example**

```ts
import { fromTraversable } from 'monocle-ts'
import { array } from 'fp-ts/lib/Array'

interface Person {
  name: string
  cool: boolean
}
type People = Person[]
const peopleTraversal = fromTraversable(array)<Person>()
const coolLens = Lens.fromProp<Person>()('cool')
const people = [{ name: 'bill', cool: false }, { name: 'jill', cool: true }]
peopleTraversal
  .filter(p => p.name === 'bill')
  .composeLens(coolLens)
  .set(true)(people) // [{name: 'bill', cool: true}, {name: 'jill', cool: true}]
```

## asFold

view a Traversal as a Fold

**Signature** (method)

```ts
asFold(): Fold<S, A> { ... }
```

## asSetter

view a Traversal as a Setter

**Signature** (method)

```ts
asSetter(): Setter<S, A> { ... }
```

## compose

compose a Traversal with a Traversal

**Signature** (method)

```ts
compose<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeTraversal

**Signature** (method)

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose a Traversal with a Fold

**Signature** (method)

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter

compose a Traversal with a Setter

**Signature** (method)

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeOptional

compose a Traversal with a Optional

**Signature** (method)

```ts
composeOptional<B>(ab: Optional<A, B>): Traversal<S, B> { ... }
```

## composeLens

compose a Traversal with a Lens

**Signature** (method)

```ts
composeLens<B>(ab: Lens<A, B>): Traversal<S, B> { ... }
```

## composePrism

compose a Traversal with a Prism

**Signature** (method)

```ts
composePrism<B>(ab: Prism<A, B>): Traversal<S, B> { ... }
```

## composeIso

compose a Traversal with a Iso

**Signature** (method)

```ts
composeIso<B>(ab: Iso<A, B>): Traversal<S, B> { ... }
```

## composeGetter

compose a Traversal with a Getter

**Signature** (method)

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# fromFoldable

create a Fold from a Foldable

**Signature** (function)

```ts
export function fromFoldable<F extends URIS3>(F: Foldable3<F>): <U, L, A>() => Fold<Type3<F, U, L, A>, A>
export function fromFoldable<F extends URIS2>(F: Foldable2<F>): <L, A>() => Fold<Type2<F, L, A>, A>
export function fromFoldable<F extends URIS>(F: Foldable1<F>): <A>() => Fold<Type<F, A>, A>
export function fromFoldable<F>(F: Foldable<F>): <A>() => Fold<HKT<F, A>, A>
export function fromFoldable<F>(F: Foldable<F>): <A>() => Fold<HKT<F, A>, A> { ... }
```

# fromTraversable

create a Traversal from a Traversable

**Signature** (function)

```ts
export function fromTraversable<T extends URIS3>(T: Traversable3<T>): <U, L, A>() => Traversal<Type3<T, U, L, A>, A>
export function fromTraversable<T extends URIS2>(T: Traversable2<T>): <L, A>() => Traversal<Type2<T, L, A>, A>
export function fromTraversable<T extends URIS>(T: Traversable1<T>): <A>() => Traversal<Type<T, A>, A>
export function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
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

const newModel = composedTraversal.modify(text =>
  text
    .split('')
    .reverse()
    .join('')
)(model)
// { tweets: [ { text: 'dlrow olleh' }, { text: 'raboof' } ] }
```
