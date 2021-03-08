---
title: At.ts
nav_order: 1
parent: Modules
---

## At overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [at](#at)
  - [atReadonlyMap](#atreadonlymap)
  - [atReadonlyRecord](#atreadonlyrecord)
  - [atReadonlySet](#atreadonlyset)
  - [fromIso](#fromiso)
- [model](#model)
  - [At (interface)](#at-interface)

---

# constructors

## at

**Signature**

```ts
export declare const at: <S, I, A>(at: (i: I) => Lens<S, A>) => At<S, I, A>
```

Added in v3.0.0

## atReadonlyMap

**Signature**

```ts
export declare const atReadonlyMap: <K>(E: Eq<K>) => <A = never>() => At<ReadonlyMap<K, A>, K, O.Option<A>>
```

Added in v3.0.0

## atReadonlyRecord

**Signature**

```ts
export declare const atReadonlyRecord: <A = never>() => At<Readonly<Record<string, A>>, string, O.Option<A>>
```

Added in v3.0.0

## atReadonlySet

**Signature**

```ts
export declare const atReadonlySet: <A>(E: Eq<A>) => At<ReadonlySet<A>, A, boolean>
```

Added in v3.0.0

## fromIso

Lift an instance of `At` using an `Iso`.

**Signature**

```ts
export declare const fromIso: <T, S>(iso: Iso<T, S>) => <I, A>(sia: At<S, I, A>) => At<T, I, A>
```

Added in v3.0.0

# model

## At (interface)

**Signature**

```ts
export interface At<S, I, A> {
  readonly at: (i: I) => Lens<S, A>
}
```

Added in v3.0.0
