import * as RA from '../../src/Index/ReadonlyArray'
import * as RNEA from '../../src/Index/ReadonlyNonEmptyArray'
import * as RR from '../../src/Index/ReadonlyRecord'

RA.indexReadonlyArray<string>().index(0) // $ExpectType Optional<readonly string[], string>

RNEA.indexReadonlyNonEmptyArray<string>().index(0) // $ExpectType Optional<ReadonlyNonEmptyArray<string>, string>

RR.indexReadonlyRecord<string>().index('a') // $ExpectType Optional<Readonly<Record<string, string>>, string>
