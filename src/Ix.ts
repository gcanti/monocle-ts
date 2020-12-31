/**
 * @since 3.0.0
 */
import { pipe } from 'fp-ts/function'
import { Option } from 'fp-ts/Option'
import { At } from './At'
import * as _ from './internal'
import { Iso } from './Iso'
import { Optional } from './Optional'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
 */
export interface Index<S, I, A> {
  readonly index: (i: I) => Optional<S, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromAt = <T, J, B>(at: At<T, J, Option<B>>): Index<T, J, B> => ({
  index: (i) => _.lensComposePrism(_.prismSome<B>())(at.at(i))
})

/**
 * Lift an instance of `Index` using an `Iso`
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromIso = <T, S>(iso: Iso<T, S>) => <I, A>(sia: Index<S, I, A>): Index<T, I, A> => ({
  index: (i) => pipe(iso, _.isoAsOptional, _.optionalComposeOptional(sia.index(i)))
})

/**
 * @category constructors
 * @since 3.0.0
 */
export const indexReadonlyArray: <A = never>() => Index<ReadonlyArray<A>, number, A> = _.indexReadonlyArray

/**
 * @category constructors
 * @since 3.0.0
 */
export const indexReadonlyRecord: <A = never>() => Index<Readonly<Record<string, A>>, string, A> = _.indexReadonlyRecord
