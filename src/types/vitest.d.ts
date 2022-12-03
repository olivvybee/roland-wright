export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(expectedValue: any): R;
    }
  }
}
