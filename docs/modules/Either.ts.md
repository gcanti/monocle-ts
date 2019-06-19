---
title: Either.ts
nav_order: 3
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [\_left (function)](#_left-function)
- [\_right (function)](#_right-function)

---

# \_left (function)

**Signature**

```ts
export const _left = <L, A>(): Prism<Either<L, A>, L> => ...
```

# \_right (function)

**Signature**

```ts
export const _right = <L, A>(): Prism<Either<L, A>, A> => ...
```
