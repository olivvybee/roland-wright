expect.extend({
  toContainObject(received, expected) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(expected)])
    );

    const message = () =>
      `Expected ${this.utils.printReceived(received)}${
        this.isNot ? ' not' : ''
      } to contain an object matching ${this.utils.printExpected(expected)}`;

    return {
      pass,
      message,
    };
  },
});
