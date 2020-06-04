/**
 * @since 2.2.0
 */
import { Option } from 'fp-ts/lib/Option'
import { At } from '../index'
import * as R from './Record'

/**
 * @since 2.2.0
 */
export const atReadonlyRecord: <A = never>() => At<Readonly<Record<string, A>>, string, Option<A>> = R.atRecord
