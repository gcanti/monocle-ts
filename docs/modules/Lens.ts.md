---
title: Lens.ts
nav_order: 17
parent: Modules
---

## Lens overview

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

- [combinators](#combinators)
  - [index](#index)
  - [modify](#modify)
  - [prop](#prop)
  - [props](#props)
  - [some](#some)
  - [traverse](#traverse)
- [compositions](#compositions)
  - [composeIso](#composeiso)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
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
  - [semigroupoidLens](#semigroupoidlens)
- [model](#model)
  - [Lens (interface)](#lens-interface)

---

# combinators

## index

Return a `Optional` from a `Lens` focused on a `ReadonlyArray`

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Lens<S, readonly A[]>) => Optional<S, A>
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
  ...props: P[]
) => <S>(lens: Lens<S, A>) => Lens<S, { [K in P]: A[K] }>
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
export declare const traverse: <T extends
  | 'ReadonlyRecord'
  | 'Ord'
  | 'Eq'
  | 'Option'
  | 'Identity'
  | 'NonEmptyArray'
  | 'Array'
  | 'Record'>(
  T: Traversable1<T>
) => <S, A>(sta: Lens<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.0

# compositions

## composeIso

Compose a `Lens` with an `Iso`

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B>
```

Added in v2.3.0

## composeLens

Compose a `Lens` with a `Lens`

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B>
```

Added in v2.3.0

## composeOptional

Compose a `Lens` with a `Optional`

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composePrism

Compose a `Lens` with a `Prism`

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composeTraversal

Compose a `Lens` with a `Traversal`

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Lens<S, A>) => Traversal<S, B>
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

## semigroupoidLens

**Signature**

```ts
export declare const semigroupoidLens: Semigroupoid2<'monocle-ts/Lens'>
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
