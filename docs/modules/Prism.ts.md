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

- [combinators](#combinators)
  - [modify](#modify)
  - [modifyOption](#modifyoption)
  - [prop](#prop)
  - [props](#props)
  - [set](#set)
  - [some](#some)
- [compositions](#compositions)
  - [composeIso](#composeiso)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
- [constructors](#constructors)
  - [fromNullable](#fromnullable)
  - [fromPredicate](#frompredicate)
  - [fromSome](#fromsome)
  - [id](#id)
- [converters](#converters)
  - [asOptional](#asoptional)
  - [asTraversal](#astraversal)
- [model](#model)
  - [Prism (interface)](#prism-interface)

---

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
  ...props: P[]
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

## composeIso

Compose a `Prism` with an `Iso`

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B>
```

Added in v2.3.0

## composeLens

Compose a `Prism` with a `Lens`

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composeOptional

Compose a `Prism` with a `Optional`

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composePrism

Compose a `Prism` with a `Prism`

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B>
```

Added in v2.3.0

## composeTraversal

Compose a `Prism` with a `Traversal`

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Prism<S, A>) => Traversal<S, B>
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
