---
title: Prism.ts
nav_order: 19
parent: Modules
---

## Prism overview

A `Prism` is an optic used to select part of a sum type.

Laws:

1. getOption(s).fold(s, reverseGet) = s
2. getOption(reverseGet(a)) = Some(a)

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [Invariant](#invariant)
  - [imap](#imap)
- [combinators](#combinators)
  - [modify](#modify)
  - [modifyOption](#modifyoption)
  - [prop](#prop)
  - [props](#props)
  - [set](#set)
  - [some](#some)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeLens](#composelens)
- [constructors](#constructors)
  - [fromNullable](#fromnullable)
  - [fromPredicate](#frompredicate)
  - [fromSome](#fromsome)
  - [id](#id)
- [converters](#converters)
  - [asOptional](#asoptional)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [categoryPrism](#categoryprism)
  - [invariantPrism](#invariantprism)
- [model](#model)
  - [Prism (interface)](#prism-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Prism<E, A>) => Prism<E, B>
```

Added in v2.3.0

# combinators

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => S
```

Added in v2.3.0

## modifyOption

**Signature**

```ts
export declare const modifyOption: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => O.Option<S>
```

Added in v2.3.0

## prop

Return a `Optional` from a `Prism` and a prop

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Prism<S, A>) => Optional<S, A[P]>
```

Added in v2.3.0

## props

Return a `Optional` from a `Prism` and a list of props

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Prism<S, A>) => Optional<S, { [K in P]: A[K] }>
```

Added in v2.3.0

## set

**Signature**

```ts
export declare const set: <A>(a: A) => <S>(sa: Prism<S, A>) => (s: S) => S
```

Added in v2.3.0

## some

Return a `Prism` from a `Prism` focused on a `Option` type

**Signature**

```ts
export declare const some: <S, A>(soa: Prism<S, O.Option<A>>) => Prism<S, A>
```

Added in v2.3.0

# compositions

## compose

Compose a `Prism` with a `Prism`

**Signature**

```ts
export declare const compose: <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B>
```

Added in v2.3.0

## composeLens

Compose a `Prism` with a `Lens`

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B>
```

Added in v2.3.0

# constructors

## fromNullable

**Signature**

```ts
export declare const fromNullable: <A>() => Prism<A, NonNullable<A>>
```

Added in v2.3.0

## fromPredicate

**Signature**

```ts
export declare const fromPredicate: {
  <S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
  <A>(predicate: Predicate<A>): Prism<A, A>
}
```

Added in v2.3.0

## fromSome

**Signature**

```ts
export declare const fromSome: <A>() => Prism<O.Option<A>, A>
```

Added in v2.3.0

## id

**Signature**

```ts
export declare const id: <S>() => Prism<S, S>
```

Added in v2.3.0

# converters

## asOptional

View a `Prism` as a `Optional`

**Signature**

```ts
export declare const asOptional: <S, A>(sa: Prism<S, A>) => Optional<S, A>
```

Added in v2.3.0

## asTraversal

View a `Prism` as a `Traversal`

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Prism<S, A>) => Traversal<S, A>
```

Added in v2.3.0

# instances

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Prism'
```

Added in v2.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.3.0

## categoryPrism

**Signature**

```ts
export declare const categoryPrism: Category2<'monocle-ts/Prism'>
```

Added in v2.3.0

## invariantPrism

**Signature**

```ts
export declare const invariantPrism: Invariant2<'monocle-ts/Prism'>
```

Added in v2.3.0

# model

## Prism (interface)

**Signature**

```ts
export interface Prism<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly reverseGet: (a: A) => S
}
```

Added in v2.3.0
