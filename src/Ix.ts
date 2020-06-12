/**
 * @since 2.3.0
 */
import { Option } from 'fp-ts/lib/Option'
import { At } from './At'
import * as I from './internal'
import { Iso } from './Iso'
import { Optional } from './Optional'
import * as P from './Prism'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.3.0
 */
export interface Index<S, I, A> {
  readonly index: (i: I) => Optional<S, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromAt = <T, J, B>(at: At<T, J, Option<B>>): Index<T, J, B> => ({
  index: (i) => I.lensComposePrism(P.some<B>())(at.at(i))
})

/**
 * Lift an instance of `Index` using an `Iso`
 *
 * @category constructors
 * @since 2.3.0
 */
export const fromIso = <T, S>(iso: Iso<T, S>) => <I, A>(sia: Index<S, I, A>): Index<T, I, A> => ({
  index: (i) => I.isoComposeOptional(sia.index(i))(iso)
})
