describe('1st tests', () => {
    it('true is true', () => expect(true).toBe(true));
    it('false is false', () => expect(false).toBe(false));
    it('true is not false', () => expect(true).not.toBe(false));
    it('false is not true', () => expect(false).not.toBe(true));
});
