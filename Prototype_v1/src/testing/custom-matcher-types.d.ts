declare namespace jasmine {
    interface Matchers<T> {
        toHaveCssClass(expected: any): boolean;
    }
}

// custom matcher, see https://stackoverflow.com/a/49405171
