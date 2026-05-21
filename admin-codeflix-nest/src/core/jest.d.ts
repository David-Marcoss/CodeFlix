declare global {
  namespace jest {
    interface Matchers<R, T = {}> {
      //containsErrorMessages: (expected: FieldsErrors) => R;
      notificationContainsErrorMessages: (
        expected: Array<string | { [key: string]: string[] }>,
      ) => R;
    }
  }
}

export {};
