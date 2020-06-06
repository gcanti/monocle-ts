---
title: Either.ts
nav_order: 5
parent: Modules
---

## Either overview

Added in v1.6.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructor](#constructor)
  - [\_left](#_left)
  - [\_right](#_right)

---

# constructor

## \_left

**Signature**

```ts
export declare const _left: <E, A>() => Prism<Either<E, A>, E>
```

Added in v1.6.0

## \_right

**Signature**

```ts
export declare const _right: <E, A>() => Prism<Either<E, A>, A>
```

Added in v1.6.0
