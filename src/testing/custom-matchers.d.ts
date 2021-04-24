declare namespace jasmine {
    interface Matchers<T> {
        toHaveCssClass(expected: string): boolean;
    }
}

// For custom matchers, see https://stackoverflow.com/a/44996479
