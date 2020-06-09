import { Option } from 'fp-ts/lib/Option'
import { fromTraversable, Lens, Optional } from '../src'
import { array } from 'fp-ts/lib/Array'
import { record } from 'fp-ts/lib/Record'
import { indexArray } from '../src/Index/Array'

interface NestedValue {
  baz: string
}
interface Nested extends Array<NestedValue> {}
interface Value {
  nested: Option<Nested>
}
interface Foo extends Record<string, Value> {}
interface Item {
  readonly foo: Foo
}
interface Items extends Array<Item> {}
interface Data {
  readonly items: Items
}

export const classicSecondBaz = Lens.fromProp<Data>()('items')
  .composeTraversal(fromTraversable(array)())
  .composeLens(Lens.fromProp<Item>()('foo'))
  .composeTraversal(fromTraversable(record)())
  .composeOptional(Optional.fromOptionProp<Value>()('nested'))
  .composeOptional(indexArray<NestedValue>().index(2))
  .composeLens(Lens.fromProp<NestedValue>()('baz'))

export const fluentSecondBaz = Lens.fromProp<Data>()('items')
  .traverse(array)
  .prop('foo')
  .traverse(record)
  .optionProp('nested')
  .index(2)
  .prop('baz')
