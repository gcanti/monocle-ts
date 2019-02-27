---
title: Either.ts
nav_order: 3
---

Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [\_left](#%5C_left)
- [\_right](#%5C_right)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# \_left

**Signature** (function)

```ts
export const _left = <L, A>(): Prism<Either<L, A>, L> => ...
```

# \_right

**Signature** (function)

```ts
export const _right = <L, A>(): Prism<Either<L, A>, A> => ...
```
