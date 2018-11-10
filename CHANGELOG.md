# Changelog

> **Tags:**
>
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]
> - [Experimental]

**Note**: Gaps between patch versions are faulty/broken releases. **Note**: A feature tagged as Experimental is in a
high state of flux, you're at risk of it changing without notice.

# 1.4.1

- **New Feature**
  - add `Prism.fromRefinement` (@bepremeg)
  - add `Optional.fromOptionProp` (@bepremeg)

# 1.3.0

- **New Feature**
  - add `Lens.{fromProp, fromPath, fromNullableProp}` and `Optional.fromNullableProp` curried overloadings (@gcanti)

# 1.2.0

- **New Feature**
  - add `At` (@leighman)
    - add `Set` instance
    - add `StrMap` instance
  - add `Index` (@leighman)
    - add `Array` instance
    - add `StrMap` instance

# 1.1.0

- **New Feature**
  - add `Lens.fromProps` (@gcanti)

# 1.0.0

- **Breaking Change**
  - upgrade to `fp-ts@1.0.0` (@gcanti)

# 0.5.2

- **New Feature**
  - add `Iso.reverse`, closes #36 (@gcanti)

# 0.5.1

- **Experimental**
  - add Flowtype support (@gcanti)

# 0.5.0

- **Breaking Change**
  - upgrade to fp-ts 0.6 (@gcanti)

# 0.4.4

- **New Feature**
  - add `Lens.fromNullableProp` (@gcanti)

# 0.4.3

- **New Feature**
  - `Prism`: add `set` method (@gcanti)
  - `Optional`: add `fromNullableProps` static function (@gcanti)
- **Bug fix**
  - `Prism`: change `asOptional`, `asTraversal` implementations, fix #29 (@gcanti)

# 0.4.2

- **Polish**
  - fix Optional laws (@gcanti)
  - remove `Endomorphism` type alias (@gcanti)

# 0.4.1

- **New Feature**
  - Add aliases to ISO, closes #24 (@gcanti)

# 0.4.0

- **Breaking Change**
  - upgrade to fp-ts 0.5 (@gcanti)
  - currying of all APIs (@gcanti)

# 0.3.2

- **Polish**
  - upgrade to latest fp-ts (0.4.3) (@gcanti)

# 0.3.1

- **New Feature**
  - Added Setter (@LiamGoodacre)
  - Added Getter (@LiamGoodacre)
  - Added all possible conversions (e.g asGetter, asFold, etc) (@LiamGoodacre)
  - Added all possible compositions (@LiamGoodacre)
  - add \_tag fields (allows for tagged unions) (@gcanti)
- **Polish**
  - Fixed some typos (Options/Option -> Optional) (@LiamGoodacre)
  - Minor rearrangement so conversions and compositions are grouped (@LiamGoodacre)

# 0.3.0

- **Breaking Change**
  - upgrade to latest fp-ts (@gcanti)

# 0.2.0

- **New Feature**
  - add `Prism.some`, closes #10 (@gcanti)
  - add `composeX`, closes #11 (@gcanti)
- **Breaking Change**
  - upgrade to latest `fp-ts` (`monocle-ts` APIs are not changed though) (@gcanti)
  - drop `lib-jsnext` folder
  - remove `Optional.fromProp`, closes #9 (@gcanti)

# 0.1.1

- **New Feature**
  - add `Prism.fromPredicate`
  - fix `Optional.fromProp`

# 0.1.0

Initial release
