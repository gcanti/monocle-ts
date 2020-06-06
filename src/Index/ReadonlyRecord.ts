/**
 * @since 2.2.0
 */
import { Index } from '../index'
import * as R from './Record'

/**
 * @category constructor
 * @since 2.2.0
 */
export const indexReadonlyRecord: <A = never>() => Index<Readonly<Record<string, A>>, string, A> = R.indexRecord
