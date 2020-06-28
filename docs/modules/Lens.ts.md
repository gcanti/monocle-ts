---
title: Lens.ts
nav_order: 17
parent: Modules
---

## Lens overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

A `Lens` is an optic used to zoom inside a product.

`Lens`es have two type parameters generally called `S` and `A`: `Lens<S, A>` where `S` represents the product and `A`
an element inside of `S`.

Laws:

1. get(set(a)(s)) = a
2. set(get(s))(s) = s
3. set(a)(set(a)(s)) = set(a)(s)

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [Invariant](#invariant)
  - [imap](#imap)
- [combinators](#combinators)
  - [component](#component)
  - [index](#index)
  - [key](#key)
  - [left](#left)
  - [modify](#modify)
  - [prop](#prop)
  - [props](#props)
  - [right](#right)
  - [some](#some)
  - [traverse](#traverse)
- [compositions](#compositions)
  - [compose](#compose)
  - [composePrism](#composeprism)
- [constructors](#constructors)
  - [fromNullable](#fromnullable)
  - [id](#id)
- [converters](#converters)
  - [asOptional](#asoptional)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [categoryLens](#categorylens)
  - [invariantLens](#invariantlens)
- [model](#model)
  - [Lens (interface)](#lens-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Lens<E, A>) => Lens<E, B>
```

Added in v2.3.0

# combinators

## component

Return a `Lens` from a `Lens` and a component

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Lens<S, A>) => Lens<S, A[P]>
```

Added in v2.3.0

## index

Return a `Optional` from a `Lens` focused on a `ReadonlyArray`

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Lens<S, readonly A[]>) => Optional<S, A>
```

Added in v2.3.0

## key

Return a `Optional` from a `Lens` focused on a `ReadonlyRecord`

**Signature**

```ts
export declare const key: (k: string) => <S, A>(sa: Lens<S, Readonly<Record<string, A>>>) => Optional<S, A>
```

Added in v2.3.0

## left

Return a `Optional` from a `Lens` focused on the `Left` of a `Either` type

**Signature**

```ts
export declare const left: <S, E, A>(soa: Lens<S, Either<E, A>>) => Optional<S, E>
```

Added in v2.3.0

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(lens: Lens<S, A>) => (s: S) => S
```

Added in v2.3.0

## prop

Return a `Lens` from a `Lens` and a prop

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(lens: Lens<S, A>) => Lens<S, A[P]>
```

Added in v2.3.0

## props

Return a `Lens` from a `Lens` and a list of props

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(lens: Lens<S, A>) => Lens<S, { [K in P]: A[K] }>
```

Added in v2.3.0

## right

Return a `Optional` from a `Lens` focused on the `Right` of a `Either` type

**Signature**

```ts
export declare const right: <S, E, A>(soa: Lens<S, Either<E, A>>) => Optional<S, A>
```

Added in v2.3.0

## some

Return a `Optional` from a `Lens` focused on a `Option` type

**Signature**

```ts
export declare const some: <S, A>(soa: Lens<S, Option<A>>) => Optional<S, A>
```

Added in v2.3.0

## traverse

Return a `Traversal` from a `Lens` focused on a `Traversable`

**Signature**

```ts
export declare function traverse<T extends URIS>(
  T: Traversable1<T>
): <S, A>(sta: Lens<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.0

# compositions

## compose

Compose a `Lens` with a `Lens`

**Signature**

```ts
export declare const compose: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B>
```

Added in v2.3.0

## composePrism

Compose a `Lens` with a `Prism`

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B>
```

Added in v2.3.0

# constructors

## fromNullable

Return a `Optional` from a `Lens` focused on a nullable value

**Signature**

```ts
export declare const fromNullable: <S, A>(sa: Lens<S, A>) => Optional<S, NonNullable<A>>
```

Added in v2.3.0

## id

**Signature**

```ts
export declare const id: <S>() => Lens<S, S>
```

Added in v2.3.0

# converters

## asOptional

View a `Lens` as a `Optional`

**Signature**

```ts
export declare const asOptional: <S, A>(sa: Lens<S, A>) => Optional<S, A>
```

Added in v2.3.0

## asTraversal

View a `Lens` as a `Traversal`

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Lens<S, A>) => Traversal<S, A>
```

Added in v2.3.0

# instances

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Lens'
```

Added in v2.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.3.0

## categoryLens

**Signature**

```ts
export declare const categoryLens: Category2<'monocle-ts/Lens'>
```

Added in v2.3.0

## invariantLens

**Signature**

```ts
export declare const invariantLens: Invariant2<'monocle-ts/Lens'>
```

Added in v2.3.0

# model

## Lens (interface)

**Signature**

```ts
export interface Lens<S, A> {
  readonly get: (s: S) => A
  readonly set: (a: A) => (s: S) => S
}
```

Added in v2.3.0
