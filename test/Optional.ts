import * as assert from 'assert'
import { Lens, Optional } from '../src'
import * as O from 'fp-ts/lib/Option'
import { identity } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: O.Option<number>
}

const optional = new Optional<A, number>(
  s => s.a,
  a => s => {
    if (O.isNone(s.a)) {
      return s
    } else {
      return { ...s, a: O.some(a) }
    }
  }
)

describe('Optional', () => {
  it('getOption', () => {
    assert.deepStrictEqual(optional.getOption({ a: O.none }), O.none)
    assert.deepStrictEqual(optional.getOption({ a: O.some(1) }), O.some(1))
  })

  it('set', () => {
    assert.deepStrictEqual(optional.set(2)({ a: O.some(1) }).a, O.some(2))
  })
  interface Phone {
    number: string
  }
  interface Employment {
    phone?: Phone
  }
  interface Info {
    employment?: Employment
  }
  interface Response {
    info?: Info
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

    assert.deepStrictEqual(numberFromResponse.getOption(response1), O.some('555-1234'))
    assert.deepStrictEqual(numberFromResponse.getOption(response2), O.none)
    assert.deepStrictEqual(numberFromResponse.set('b')(response1), {
      info: {
        employment: {
          phone: {
            number: 'b'
          }
        }
      }
    })
    assert.deepStrictEqual(numberFromResponse.set('b')(response2), response2)
    assert.strictEqual(numberFromResponse.set('555-1234')(response1), response1)
    assert.strictEqual(numberFromResponse.modify(identity)(response1), response1)
    assert.strictEqual(numberFromResponse.modify(identity)(response2), response2)
  })

  it('fromNullableProp', () => {
    const phoneNumber = Lens.fromProp<Phone>()('number')

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

    const info = Optional.fromNullableProp<Response>()('info')
    const employment = Optional.fromNullableProp<Info>()('employment')
    const phone = Optional.fromNullableProp<Employment>()('phone')
    const numberFromResponse = info
      .compose(employment)
      .compose(phone)
      .composeLens(phoneNumber)

    assert.deepStrictEqual(numberFromResponse.getOption(response1), O.some('555-1234'))
    assert.deepStrictEqual(numberFromResponse.getOption(response2), O.none)
    assert.deepStrictEqual(numberFromResponse.set('b')(response1), {
      info: {
        employment: {
          phone: {
            number: 'b'
          }
        }
      }
    })
    assert.deepStrictEqual(numberFromResponse.set('b')(response2), response2)
    assert.strictEqual(numberFromResponse.set('555-1234')(response1), response1)
    assert.strictEqual(numberFromResponse.modify(identity)(response1), response1)
    assert.strictEqual(numberFromResponse.modify(identity)(response2), response2)
  })

  it('fromOptionProp', () => {
    interface Phone {
      number: string
    }
    interface Employment {
      phone: O.Option<Phone>
    }
    interface Info {
      employment: O.Option<Employment>
    }
    interface Response {
      info: O.Option<Info>
    }

    const phoneNumber = Lens.fromProp<Phone>()('number')

    const response1: Response = {
      info: O.some({
        employment: O.some({
          phone: O.some({
            number: '555-1234'
          })
        })
      })
    }
    const response2: Response = {
      info: O.some({
        employment: O.none
      })
    }

    const info = Optional.fromOptionProp<Response>()('info')
    const employment = Optional.fromOptionProp<Info>()('employment')
    const phone = Optional.fromOptionProp<Employment>()('phone')
    const numberFromResponse = info
      .compose(employment)
      .compose(phone)
      .composeLens(phoneNumber)

    assert.deepStrictEqual(numberFromResponse.getOption(response1), O.some('555-1234'))
    assert.deepStrictEqual(numberFromResponse.getOption(response2), O.none)

    // Check the laws
    const opt = numberFromResponse
    // Law 1
    assert.deepStrictEqual(opt.set('555-4321')(response1), {
      info: O.some({
        employment: O.some({
          phone: O.some({
            number: '555-4321'
          })
        })
      })
    })
    assert.deepStrictEqual(opt.set('555-4321')(response2), response2)
    // Law 2
    assert.deepStrictEqual(
      opt.getOption(opt.set('555-4321')(response1)),
      pipe(
        opt.getOption(response1),
        O.map(() => '555-4321')
      )
    )
    assert.deepStrictEqual(
      opt.getOption(opt.set('555-4321')(response2)),
      pipe(
        opt.getOption(response2),
        O.map(() => '555-4321')
      )
    )
    // law 3
    assert.deepStrictEqual(opt.set('555-4321')(opt.set('555-4321')(response1)), opt.set('555-4321')(response1))
    assert.deepStrictEqual(opt.set('555-4321')(opt.set('555-4321')(response2)), opt.set('555-4321')(response2))
  })

  it('modify', () => {
    const double = (n: number): number => n * 2
    assert.deepStrictEqual(optional.modify(double)({ a: O.some(2) }), { a: O.some(4) })
    assert.deepStrictEqual(optional.modify(double)({ a: O.none }), { a: O.none })
  })

  it('compose', () => {
    interface Phone {
      number: O.Option<string>
    }
    interface Employment {
      phone: O.Option<Phone>
    }
    const phone = Optional.fromOptionProp<Employment>()('phone')
    const phoneNumber = Optional.fromOptionProp<Phone>()('number')
    const composition1 = phone.compose(phoneNumber)
    const composition2 = phone.composeOptional(phoneNumber)
    assert.deepStrictEqual(composition1.getOption({ phone: O.none }), O.none)
    assert.deepStrictEqual(composition1.getOption({ phone: O.some({ number: O.none }) }), O.none)
    assert.deepStrictEqual(composition1.getOption({ phone: O.some({ number: O.some('a') }) }), O.some('a'))
    assert.deepStrictEqual(composition1.set('a')({ phone: O.none }), { phone: O.none })
    assert.deepStrictEqual(composition1.set('a')({ phone: O.some({ number: O.none }) }), {
      phone: O.some({ number: O.none })
    })
    assert.deepStrictEqual(composition1.set('a')({ phone: O.some({ number: O.some('b') }) }), {
      phone: O.some({ number: O.some('a') })
    })

    assert.deepStrictEqual(composition2.getOption({ phone: O.none }), composition1.getOption({ phone: O.none }))
    assert.deepStrictEqual(
      composition2.getOption({ phone: O.some({ number: O.none }) }),
      composition1.getOption({ phone: O.some({ number: O.none }) })
    )
    assert.deepStrictEqual(
      composition2.getOption({ phone: O.some({ number: O.some('a') }) }),
      composition1.getOption({ phone: O.some({ number: O.some('a') }) })
    )

    assert.deepStrictEqual(composition2.set('a')({ phone: O.none }), composition1.set('a')({ phone: O.none }))
    assert.deepStrictEqual(
      composition2.set('a')({ phone: O.some({ number: O.none }) }),
      composition1.set('a')({ phone: O.some({ number: O.none }) })
    )
    assert.deepStrictEqual(
      composition2.set('a')({ phone: O.some({ number: O.some('b') }) }),
      composition1.set('a')({ phone: O.some({ number: O.some('b') }) })
    )
  })
})
