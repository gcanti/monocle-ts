---
title: Optional.ts
nav_order: 18
parent: Modules
---

## Optional overview

An `Optional` is an optic used to zoom inside a product. Unlike the `Lens`, the element that the `Optional` focuses
on may not exist.

`Optional`s have two type parameters generally called `S` and `A`: `Optional<S, A>` where `S` represents the product
and `A` an optional element inside of `S`.

Laws:

1. getOption(s).fold(() => s, a => set(a)(s)) = s
2. getOption(set(a)(s)) = getOption(s).map(\_ => a)
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
  - [modify](#modify)
  - [modifyOption](#modifyoption)
  - [prop](#prop)
  - [props](#props)
  - [some](#some)
- [compositions](#compositions)
  - [compose](#compose)
- [constructors](#constructors)
  - [id](#id)
- [converters](#converters)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [categoryOptional](#categoryoptional)
  - [invariantOptional](#invariantoptional)
- [model](#model)
  - [Optional (interface)](#optional-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Optional<E, A>) => Optional<E, B>
```

Added in v2.3.0

# combinators

## component

Return a `Optional` from a `Optional` and a component

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Optional<S, A>) => Optional<S, A[P]>
```

Added in v2.3.0

## index

Return a `Optional` from a `Optional` focused on a `ReadonlyArray`

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Optional<S, readonly A[]>) => Optional<S, A>
```

Added in v2.3.0

## key

Return a `Optional` from a `Optional` focused on a `ReadonlyRecord`

**Signature**

```ts
export declare const key: (k: string) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>) => Optional<S, A>
```

Added in v2.3.0

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => S
```

Added in v2.3.0

## modifyOption

**Signature**

```ts
export declare const modifyOption: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => O.Option<S>
```

Added in v2.3.0

## prop

Return a `Optional` from a `Optional` and a prop

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Optional<S, A>) => Optional<S, A[P]>
```

Added in v2.3.0

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

Added in v2.3.0

## some

Return a `Optional` from a `Optional` focused on a `Option` type

**Signature**

```ts
export declare const some: <S, A>(soa: Optional<S, O.Option<A>>) => Optional<S, A>
```

Added in v2.3.0

# compositions

## compose

Compose a `Optional` with a `Optional`

**Signature**

```ts
export declare const compose: <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B>
```

Added in v2.3.0

# constructors

## id

**Signature**

```ts
export declare const id: <S>() => Optional<S, S>
```

Added in v2.3.0

# converters

## asTraversal

View a `Optional` as a `Traversal`

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Optional<S, A>) => Traversal<S, A>
```

Added in v2.3.0

# instances

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Optional'
```

Added in v2.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.3.0

## categoryOptional

**Signature**

```ts
export declare const categoryOptional: Category2<'monocle-ts/Optional'>
```

Added in v2.3.0

## invariantOptional

**Signature**

```ts
export declare const invariantOptional: Invariant2<'monocle-ts/Optional'>
```

Added in v2.3.0

# model

## Optional (interface)

**Signature**

```ts
export interface Optional<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly set: (a: A) => (s: S) => S
}
```

Added in v2.3.0
