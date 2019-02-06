import { Either, right, left } from 'fp-ts/lib/Either'
import { fromEither, none, some } from 'fp-ts/lib/Option'
import { Prism } from '.'

const r = new Prism<Either<any, any>, any>(fromEither, right)

export const _right = <L, A>(): Prism<Either<L, A>, A> => r

const l = new Prism<Either<any, any>, any>(e => e.fold(some, () => none), left)

export const _left = <L, A>(): Prism<Either<L, A>, L> => l
