import * as RR from '../../src/At/ReadonlyRecord'
import * as RS from '../../src/At/ReadonlySet'
import { eqString } from 'fp-ts/lib/Eq'

RR.atReadonlyRecord<string>().at('a') // $ExpectType Lens<Readonly<Record<string, string>>, Option<string>>

RS.atReadonlySet(eqString).at('a') // $ExpectType Lens<ReadonlySet<string>, boolean>
