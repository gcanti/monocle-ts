import * as assert from 'assert'
import { identity } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Optional } from '../../src'
import * as U from '../util'

describe('Optional', () => {
  interface Phone {
    readonly number: string
  }
  interface Employment {
    readonly phone?: Phone
  }
  interface Info {
    readonly employment?: Employment
  }
  interface Response {
    readonly info?: Info
  }

  it('fromPath', () => {
    const response1: Response = {
      info: {
        employment: {
          phone: {
            number: '555-1234'
          }
        }
      }
    }
    const response2: Response = {
      info: {
        employment: {}
      }
    }

    const numberFromResponse = Optional.fromPath<Response>()(['info', 'employment', 'phone', 'number'])

    U.deepStrictEqual(numberFromResponse.getOption(response1), O.some('555-1234'))
    U.deepStrictEqual(numberFromResponse.getOption(response2), O.none)
    U.deepStrictEqual(numberFromResponse.set('b')(response1), {
      info: {
        employment: {
          phone: {
            number: 'b'
          }
        }
      }
    })
    U.deepStrictEqual(numberFromResponse.set('b')(response2), response2)
    assert.strictEqual(numberFromResponse.set('555-1234')(response1), response1)
    assert.strictEqual(numberFromResponse.modify(identity)(response1), response1)
    assert.strictEqual(numberFromResponse.modify(identity)(response2), response2)
  })

  it('fromNullableProp', () => {
    // --------------------------------------------------------
    // laws
    // --------------------------------------------------------

    //
    // 2.
    //

    interface S {
      readonly a: number | undefined | null
    }
    const optional = Optional.fromNullableProp<S>()('a')
    const s1: S = { a: undefined }
    const s2: S = { a: null }
    const s3: S = { a: 1 }
    U.deepStrictEqual(optional.set(2)(s1), s1)
    U.deepStrictEqual(optional.set(2)(s2), s2)
    U.deepStrictEqual(optional.set(2)(s3), { a: 2 })
  })

  it('fromOptionProp', () => {
    interface S {
      readonly a: O.Option<number>
    }
    const optional = Optional.fromOptionProp<S>()('a')
    const s1: S = { a: O.none }
    const s2: S = { a: O.some(1) }
    U.deepStrictEqual(optional.set(2)(s1), s1)
    U.deepStrictEqual(optional.set(2)(s2), { a: O.some(2) })
  })

  it('modify', () => {
    interface S {
      readonly a: O.Option<number>
    }
    const optional = Optional.fromOptionProp<S>()('a')
    const double = (n: number): number => n * 2
    U.deepStrictEqual(optional.modify(double)({ a: O.some(2) }), { a: O.some(4) })
    U.deepStrictEqual(optional.modify(double)({ a: O.none }), { a: O.none })
  })

  it('compose', () => {
    interface Phone {
      readonly number: O.Option<string>
    }
    interface Employment {
      readonly phone: O.Option<Phone>
    }
    const phone = Optional.fromOptionProp<Employment>()('phone')
    const phoneNumber = Optional.fromOptionProp<Phone>()('number')
    const composition1 = phone.compose(phoneNumber)
    const composition2 = phone.composeOptional(phoneNumber)
    U.deepStrictEqual(composition1.getOption({ phone: O.none }), O.none)
    U.deepStrictEqual(composition1.getOption({ phone: O.some({ number: O.none }) }), O.none)
    U.deepStrictEqual(composition1.getOption({ phone: O.some({ number: O.some('a') }) }), O.some('a'))
    U.deepStrictEqual(composition1.set('a')({ phone: O.none }), { phone: O.none })
    U.deepStrictEqual(composition1.set('a')({ phone: O.some({ number: O.none }) }), {
      phone: O.some({ number: O.none })
    })
    U.deepStrictEqual(composition1.set('a')({ phone: O.some({ number: O.some('b') }) }), {
      phone: O.some({ number: O.some('a') })
    })

    U.deepStrictEqual(composition2.getOption({ phone: O.none }), composition1.getOption({ phone: O.none }))
    U.deepStrictEqual(
      composition2.getOption({ phone: O.some({ number: O.none }) }),
      composition1.getOption({ phone: O.some({ number: O.none }) })
    )
    U.deepStrictEqual(
      composition2.getOption({ phone: O.some({ number: O.some('a') }) }),
      composition1.getOption({ phone: O.some({ number: O.some('a') }) })
    )

    U.deepStrictEqual(composition2.set('a')({ phone: O.none }), composition1.set('a')({ phone: O.none }))
    U.deepStrictEqual(
      composition2.set('a')({ phone: O.some({ number: O.none }) }),
      composition1.set('a')({ phone: O.some({ number: O.none }) })
    )
    U.deepStrictEqual(
      composition2.set('a')({ phone: O.some({ number: O.some('b') }) }),
      composition1.set('a')({ phone: O.some({ number: O.some('b') }) })
    )
  })
})
