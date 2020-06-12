/**
 * @since 2.2.0
 */
import { Eq } from 'fp-ts/lib/Eq'
import { At } from '..'
import * as S from './Set'

/**
 * @category constructor
 * @since 2.2.0
 */
export const atReadonlySet: <A = never>(E: Eq<A>) => At<ReadonlySet<A>, A, boolean> = S.atSet as any
