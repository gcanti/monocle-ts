export function shallowCopy<T, P>(object: T, newProperties?: P): T & P {
  if (object == null) {
    return object
  }

  // Copy array
  if (Array.isArray(object)) {
    const newArray = ([...object] as any) as T & P

    if (newProperties == null) {
      return newArray
    }

    const newPropertiesProperties = Object.getOwnPropertyDescriptors(newProperties)

    for (const key in newPropertiesProperties) {
      newArray[key] = newPropertiesProperties[key].value
    }

    return newArray
  }

  // Copy _raw_ object
  if (Object.getPrototypeOf(object) === Object.prototype) {
    if (newProperties == null) {
      return { ...(object as any) }
    }

    return { ...(object as any), ...(newProperties as any) }
  }

  // Copy class instance, preserving prototype and preventing new properties
  const newObjectPrototype = Object.getPrototypeOf(object)
  const newObjectProperties = Object.getOwnPropertyDescriptors(object)

  if (newProperties == null) {
    return Object.create(newObjectPrototype, newObjectProperties)
  }

  const newPropertiesProperties = Object.getOwnPropertyDescriptors(newProperties)

  for (const key in newPropertiesProperties) {
    if (key in newObjectProperties) {
      newObjectProperties[key].value = newPropertiesProperties[key].value
    }
  }

  return Object.create(newObjectPrototype, newObjectProperties)
}
