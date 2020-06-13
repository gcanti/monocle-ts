/**
 * @since 2.2.0
 */
import { Index } from '..'
import * as A from './Array'

/**
 * @category constructor
 * @since 2.2.0
 */
export const indexReadonlyArray: <A = never>() => Index<ReadonlyArray<A>, number, A> = A.indexArray as any
