/**
 * @since 2.2.0
 */
import { Index } from '..'
import * as NEA from './NonEmptyArray'

/**
 * @category model
 * @since 2.2.0
 */
export interface ReadonlyNonEmptyArray<A> extends ReadonlyArray<A> {
  readonly 0: A
}

/**
 * @category constructor
 * @since 2.2.0
 */
export const indexReadonlyNonEmptyArray: <A = never>() => Index<
  ReadonlyNonEmptyArray<A>,
  number,
  A
> = NEA.indexNonEmptyArray as any
