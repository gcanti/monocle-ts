import { Iso, Lens, Prism, Optional, Traversal, Getter, Fold, Setter } from '../src'
import * as assert from 'assert'

type U0 = true
type U1 = false

// This test exists to type check the optic conversion functions

const anIso = new Iso<U0, U1>(() => false, () => true)

const hasType = <T>(_: T): void => assert(true)

describe('Conversions', () => {
  it('type check', () => {
    // Iso conversions
    const isoLens: Lens<U0, U1> = anIso.asLens()
    const isoPrism: Prism<U0, U1> = anIso.asPrism()
    const isoOptional: Optional<U0, U1> = anIso.asOptional()
    const isoTraversal: Traversal<U0, U1> = anIso.asTraversal()
    const isoGetter: Getter<U0, U1> = anIso.asGetter()
    hasType<Fold<U0, U1>>(anIso.asFold())
    hasType<Setter<U0, U1>>(anIso.asSetter())

    // Lens conversions
    hasType<Optional<U0, U1>>(isoLens.asOptional())
    hasType<Traversal<U0, U1>>(isoLens.asTraversal())
    hasType<Getter<U0, U1>>(isoLens.asGetter())
    hasType<Fold<U0, U1>>(isoLens.asFold())
    hasType<Setter<U0, U1>>(isoLens.asSetter())

    // Prism conversions
    hasType<Optional<U0, U1>>(isoPrism.asOptional())
    hasType<Traversal<U0, U1>>(isoPrism.asTraversal())
    hasType<Fold<U0, U1>>(isoPrism.asFold())
    hasType<Setter<U0, U1>>(isoPrism.asSetter())

    // Optional conversions
    hasType<Traversal<U0, U1>>(isoOptional.asTraversal())
    hasType<Fold<U0, U1>>(isoOptional.asFold())
    hasType<Setter<U0, U1>>(isoOptional.asSetter())

    // Traversal conversions
    hasType<Fold<U0, U1>>(isoTraversal.asFold())
    hasType<Setter<U0, U1>>(isoTraversal.asSetter())

    // Getter conversions
    hasType<Fold<U0, U1>>(isoGetter.asFold())
  })
})
