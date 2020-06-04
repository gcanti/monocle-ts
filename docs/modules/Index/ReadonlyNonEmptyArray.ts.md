---
title: Index/ReadonlyNonEmptyArray.ts
nav_order: 10
parent: Modules
---

# ReadonlyNonEmptyArray overview

Added in v2.2.0

---

<h2 class="text-delta">Table of contents</h2>

- [ReadonlyNonEmptyArray (interface)](#readonlynonemptyarray-interface)
- [indexReadonlyNonEmptyArray](#indexreadonlynonemptyarray)

---

# ReadonlyNonEmptyArray (interface)

**Signature**

```ts
export interface ReadonlyNonEmptyArray<A> extends ReadonlyArray<A> {
  readonly 0: A
}
```

Added in v2.2.0

# indexReadonlyNonEmptyArray

**Signature**

```ts
export declare const indexReadonlyNonEmptyArray: <A = never>() => Index<ReadonlyNonEmptyArray<A>, number, A>
```

Added in v2.2.0
