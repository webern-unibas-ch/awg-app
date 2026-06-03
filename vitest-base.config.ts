// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: false, // (default: true)
        isolate: true, // (default true)
    },
});
