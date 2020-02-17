import { SimplePrefixPipe } from './prefix-simple.pipe';

describe('PrefixSimplePipe', () => {
    it('create an instance', () => {
        const pipe = new SimplePrefixPipe();
        expect(pipe).toBeTruthy();
    });
});
