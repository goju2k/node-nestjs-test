export default class BaseAbstract {
  res<T>(value: T): Promise<T> {
    return new Promise<T>(resolve=>resolve(value))
  }
}
