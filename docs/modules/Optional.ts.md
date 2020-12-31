---
title: Optional.ts
nav_order: 7
parent: Modules
---

## Optional overview

An `Optional` is an optic used to zoom inside a product. Unlike the `Lens`, the element that the `Optional` focuses
on may not exist.

`Optional`s have two type parameters generally called `S` and `A`: `Optional<S, A>` where `S` represents the product
and `A` an optional element inside of `S`.

Laws:

1. pipe(getOption(s), fold(() => s, a => set(a)(s))) = s
2. getOption(set(a)(s)) = pipe(getOption(s), map(\_ => a))
3. set(a)(set(a)(s)) = set(a)(s)

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Category](#category)
  - [id](#id)
- [Invariant](#invariant)
  - [imap](#imap)
- [Semigroupoid](#semigroupoid)
  - [compose](#compose)
- [combinators](#combinators)
  - [atKey](#atkey)
  - [component](#component)
  - [filter](#filter)
  - [findFirst](#findfirst)
  - [fromNullable](#fromnullable)
  - [index](#index)
  - [key](#key)
  - [left](#left)
  - [modify](#modify)
  - [modifyOption](#modifyoption)
  - [prop](#prop)
  - [props](#props)
  - [right](#right)
  - [some](#some)
  - [traverse](#traverse)
- [converters](#converters)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [Category](#category-1)
  - [Invariant](#invariant-1)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [model](#model)
  - [Optional (interface)](#optional-interface)

---

# Category

## id

**Signature**

```ts
export declare const id: <S>() => Optional<S, S>
```

Added in v3.0.0

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Optional<E, A>) => Optional<E, B>
```

Added in v3.0.0

# Semigroupoid

## compose

Compose a `Optional` with a `Optional`

**Signature**

```ts
export declare const compose: <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B>
```

Added in v3.0.0

# combinators

## atKey

Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a required key

**Signature**

```ts
export declare const atKey: (
  key: string
) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>) => Optional<S, O.Option<A>>
```

Added in v3.0.0

## component

Return a `Optional` from a `Optional` and a component

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Optional<S, A>) => Optional<S, A[P]>
```

Added in v3.0.0

## filter

**Signature**

```ts
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Optional<S, A>) => Optional<S, B>
export declare function filter<A>(predicate: Predicate<A>): <S>(sa: Optional<S, A>) => Optional<S, A>
```

Added in v3.0.0

## findFirst

**Signature**

```ts
export declare const findFirst: <A>(predicate: Predicate<A>) => <S>(sa: Optional<S, readonly A[]>) => Optional<S, A>
```

Added in v3.0.0

## fromNullable

Return an `Optional` from a `Optional` focused on a nullable value

**Signature**

```ts
export declare const fromNullable: <S, A>(sa: Optional<S, A>) => Optional<S, NonNullable<A>>
```

Added in v3.0.0

## index

Return a `Optional` from a `Optional` focused on a `ReadonlyArray`

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Optional<S, readonly A[]>) => Optional<S, A>
```

Added in v3.0.0

## key

Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a key

**Signature**

```ts
export declare const key: (key: string) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>) => Optional<S, A>
```

Added in v3.0.0

## left

Return a `Optional` from a `Optional` focused on the `Left` of a `Either` type

**Signature**

```ts
export declare const left: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, E>
```

Added in v3.0.0

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => S
```

Added in v3.0.0

## modifyOption

**Signature**

```ts
export declare const modifyOption: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => O.Option<S>
```

Added in v3.0.0

## prop

Return a `Optional` from a `Optional` and a prop

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Optional<S, A>) => Optional<S, A[P]>
```

Added in v3.0.0

## props

Return a `Optional` from a `Optional` and a list of props

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Optional<S, A>) => Optional<S, { [K in P]: A[K] }>
```

Added in v3.0.0

## right

Return a `Optional` from a `Optional` focused on the `Right` of a `Either` type

**Signature**

```ts
export declare const right: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, A>
```

Added in v3.0.0

## some

Return a `Optional` from a `Optional` focused on the `Some` of a `Option` type

**Signature**

```ts
export declare const some: <S, A>(soa: Optional<S, O.Option<A>>) => Optional<S, A>
```

Added in v3.0.0

## traverse

Return a `Traversal` from a `Optional` focused on a `Traversable`

**Signature**

```ts
export declare function traverse<T extends URIS>(
  T: Traversable1<T>
): <S, A>(sta: Optional<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v3.0.0

# converters

## asTraversal

View a `Optional` as a `Traversal`

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Optional<S, A>) => Traversal<S, A>
```

Added in v3.0.0

# instances

## Category

**Signature**

```ts
export declare const Category: Category2<'monocle-ts/Optional'>
```

Added in v3.0.0

## Invariant

**Signature**

```ts
export declare const Invariant: Invariant2<'monocle-ts/Optional'>
```

Added in v3.0.0

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Optional'
```

Added in v3.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.0.0

# model

## Optional (interface)

**Signature**

```ts
export interface Optional<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly set: (a: A) => (s: S) => S
}
```

Added in v3.0.0
