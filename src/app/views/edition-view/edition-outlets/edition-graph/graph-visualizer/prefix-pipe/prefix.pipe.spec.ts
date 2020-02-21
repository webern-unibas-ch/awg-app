import { PrefixPipe } from './prefix.pipe';

describe('PrefixSimplePipe', () => {
    it('create an instance', () => {
        const pipe = new PrefixPipe();
        expect(pipe).toBeTruthy();
    });
});
