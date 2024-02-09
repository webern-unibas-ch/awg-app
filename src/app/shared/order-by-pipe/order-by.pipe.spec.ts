/**
 * **********************************************
 *
 *               CREDITS
 *
 * This code is inspired, adapted or taken from:
 *
 * [**https://github.com/VadimDez/ngx-order-pipe**](https://github.com/VadimDez/ngx-order-pipe/blob/master/src/app/order-pipe/ngx-order.pipe.spec.ts) Build v2.2.0 on 12/11/2021, 14:45 MEZ
 *
 *
 ************************************************/

import { expectToEqual } from '@testing/expect-helper';

import { OrderByPipe } from './order-by.pipe';

describe('OrderByPipe (DONE)', () => {
    let pipe: OrderByPipe;

    beforeEach(() => {
        pipe = new OrderByPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('... should return empty array', () => {
        expectToEqual(pipe.transform([], 'anything'), []);
    });

    it('... should work with not defined array as well', () => {
        let array;
        expect(pipe.transform(array, 'anything')).toBeUndefined();
        expect(pipe.transform(array, 'anything')).toEqual(array);
    });

    describe('without expression', () => {
        it('... should sort simple array', () => {
            const array = [3, 2, 1];
            const sortedArray = [1, 2, 3];

            expectToEqual(pipe.transform(array), sortedArray);
        });

        it('... should sort simple chars array', () => {
            const array = ['b', 'c', 'a'];
            const sortedArray = ['a', 'b', 'c'];

            expectToEqual(pipe.transform(array), sortedArray);
        });

        it('... should move `null` to the end', () => {
            const array = [3, null, 1];
            const sortedArray = [1, 3, null];

            expectToEqual(pipe.transform(array), sortedArray);
        });

        it('... should move `undefind` to the end', () => {
            const array = [3, undefined, 1];
            const sortedArray = [1, 3, undefined];

            expectToEqual(pipe.transform(array), sortedArray);
        });

        it('... should keep `NaN` as it is', () => {
            const array = [3, NaN, 1];
            const sortedArray = [1, NaN, 3];

            expectToEqual(pipe.transform(array), sortedArray);
        });
    });

    describe('if given expression is not found', () => {
        it('... should not sort simple array', () => {
            const array = [3, 2, 1];
            const arraySorted = [3, 2, 1];

            expectToEqual(pipe.transform(array, 'anything'), arraySorted);
        });

        it('... should not sort simple chars array', () => {
            const array = ['c', 'b', 'a'];
            const arraySorted = ['c', 'b', 'a'];

            expectToEqual(pipe.transform(array, 'anything'), arraySorted);
        });

        it('... should move empty string to the start', () => {
            const array = ['c', '', 'a'];
            const arraySorted = ['', 'c', 'a'];

            expectToEqual(pipe.transform(array, 'anything'), arraySorted);
        });

        it('... should keep `NaN` as it is', () => {
            const array = [3, NaN, 1];
            const sortedArray = [1, NaN, 3];

            expectToEqual(pipe.transform(array, 'anything'), sortedArray);
        });

        it('... should move `null` to the end', () => {
            const array = [3, null, 1];
            const arraySorted = [3, 1, null];

            expectToEqual(pipe.transform(array, 'anything'), arraySorted);
        });

        it('... should move `undefined` to the end', () => {
            const array = [3, null, 1];
            const arraySorted = [3, 1, null];

            expectToEqual(pipe.transform(array, 'anything'), arraySorted);
        });
    });

    it('... should return array with one element as it is', () => {
        const array = [{ id: 1 }];
        expectToEqual(pipe.transform(array, 'id'), array);
    });

    it('... should return already sorted array as it is', () => {
        const alreadySortedArray = [{ id: 1 }, { id: 2 }];
        expectToEqual(pipe.transform(alreadySortedArray, 'id'), alreadySortedArray);
    });

    it('... should order by id', () => {
        const numbers = [{ id: 3 }, { id: 2 }, { id: 1 }];
        const sortedNumbers = [{ id: 1 }, { id: 2 }, { id: 3 }];

        expectToEqual(pipe.transform(numbers, 'id'), sortedNumbers);
    });

    it('... should order by a', () => {
        const arrayA = [{ a: 2 }, { a: null }, { a: 1 }, { a: 3 }];
        const arrayB = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: null }];

        expectToEqual(pipe.transform(arrayA, 'a'), arrayB);
    });

    it('... should sort strings too', () => {
        const array = [{ string: 'abc' }, { string: 'aaa' }, { string: 'b' }];
        const arraySorted = [{ string: 'aaa' }, { string: 'abc' }, { string: 'b' }];

        expectToEqual(pipe.transform(array, 'string'), arraySorted);
    });

    it('... should sort case-sensitive strings', () => {
        const array = [{ string: 'Abc' }, { string: 'abc' }, { string: 'b' }, { string: 'B' }];
        const arraySorted = [{ string: 'Abc' }, { string: 'B' }, { string: 'abc' }, { string: 'b' }];

        expectToEqual(pipe.transform(array, 'string', false, false), arraySorted);
    });

    it('... should sort strings with case-sensitivity by default', () => {
        const array = [{ string: 'Abc' }, { string: 'abc' }, { string: 'b' }, { string: 'B' }];
        const arraySorted = [{ string: 'Abc' }, { string: 'B' }, { string: 'abc' }, { string: 'b' }];

        expectToEqual(pipe.transform(array, 'string', false), arraySorted);
    });

    it('... should sort case-insensitive strings too', () => {
        const array = [{ string: 'Abc' }, { string: 'aaa' }, { string: 'b' }];
        const arraySorted = [{ string: 'aaa' }, { string: 'Abc' }, { string: 'b' }];

        expectToEqual(pipe.transform(array, 'string', false, true), arraySorted);
    });

    it('... should not revert ordered array if `reverse=false`', () => {
        const array = [{ value: 10 }, { value: 1 }, { value: 5 }];
        const arraySorted = [{ value: 1 }, { value: 5 }, { value: 10 }];

        expectToEqual(pipe.transform(array, 'value', false), arraySorted);
    });

    it('... should revert ordered array if `reverse=true`', () => {
        const array = [{ value: 10 }, { value: 1 }, { value: 5 }];
        const arraySortedAndReverse = [{ value: 10 }, { value: 5 }, { value: 1 }];

        expectToEqual(pipe.transform(array, 'value', true), arraySortedAndReverse);
    });

    it('... should order arrays', () => {
        const array = [{ values: [10, 0] }, { values: [1, 2] }, { values: [0, -1, 1] }];
        const arraySorted = [{ values: [0, -1, 1] }, { values: [1, 2] }, { values: [10, 0] }];

        expectToEqual(pipe.transform(array, 'values'), arraySorted);
    });

    it('... should order nested elements', () => {
        const object = {
            b: {
                c: [2, 1, 3],
                d: ['h', 'ch'],
                e: [{}, { f: 'g' }],
                f: 'i',
            },
        };
        const sortedObject = {
            b: {
                c: [1, 2, 3],
                d: ['h', 'ch'],
                e: [{}, { f: 'g' }],
                f: 'i',
            },
        };

        expectToEqual(pipe.transform(object, 'b.c'), sortedObject);
        expectToEqual(pipe.transform(object, 'b.e[1].f'), object);
        expectToEqual(pipe.transform(object, 'b.e[2].f'), object);
    });

    it('... should not throw error on ordering "undefined" deep element', () => {
        const object = {
            b: {
                e: [{}, { f: 'g' }],
            },
        };

        expectToEqual(pipe.transform(object, 'b.e[2].f'), object);
    });

    it('... should sort deep elements', () => {
        const object = {
            lists: {
                users: [{ id: 3 }, { id: 2 }, { id: 1 }],
            },
        };
        const objectSorted = {
            lists: {
                users: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
        };

        expectToEqual(pipe.transform(object, 'lists.users.id'), objectSorted);
    });

    it('... should sort array by deep prop', () => {
        const arr = [
            { customer: { name: 'test' } },
            { customer: { name: 'b' } },
            { customer: { name: 'a' } },
            { customer: { name: 'c' } },
        ];

        const res = [
            { customer: { name: 'a' } },
            { customer: { name: 'b' } },
            { customer: { name: 'c' } },
            { customer: { name: 'test' } },
        ];

        expectToEqual(pipe.transform(arr, 'customer.name'), res);

        const array = [
            { customer: { number: 25 } },
            { customer: { number: 5 } },
            { customer: { number: 0 } },
            { customer: { number: 15 } },
            { customer: { number: 1 } },
        ];

        const result = [
            { customer: { number: 0 } },
            { customer: { number: 1 } },
            { customer: { number: 5 } },
            { customer: { number: 15 } },
            { customer: { number: 25 } },
        ];

        expectToEqual(pipe.transform(array, 'customer.number'), result);
    });

    it('... should sort case-insensitive array by deep prop', () => {
        const arr = [
            { customer: { name: 'test' } },
            { customer: { name: 'B' } },
            { customer: { name: 'a' } },
            { customer: { name: 'c' } },
        ];

        const res = [
            { customer: { name: 'a' } },
            { customer: { name: 'B' } },
            { customer: { name: 'c' } },
            { customer: { name: 'test' } },
        ];

        expectToEqual(pipe.transform(arr, 'customer.name', false, true), res);
    });

    it('... should sort array with deep functions', () => {
        function dupl(n: number): number {
            return n * 2;
        }
        function dupl1(): number {
            return dupl(1);
        }
        function dupl2(): number {
            return dupl(2);
        }
        function dupl3(): number {
            return dupl(3);
        }

        const array = [{ customer: { fn: dupl3 } }, { customer: { fn: dupl2 } }, { customer: { fn: dupl1 } }];

        const arraySorted = [{ customer: { fn: dupl1 } }, { customer: { fn: dupl2 } }, { customer: { fn: dupl3 } }];

        expectToEqual(pipe.transform(array, 'customer.fn'), arraySorted);
    });

    it('... should keep same order', () => {
        const collection = [
            {
                name: 'John',
                age: '25',
                score: 12,
                percent: '5.2%',
            },
            {
                name: 'Mark',
                age: '19',
                score: 12,
                percent: 'No Value',
            },
            {
                name: 'Peter',
                age: '21',
                score: 12,
                percent: '1.8%',
            },
        ];

        expectToEqual(pipe.transform(collection, 'score'), collection);
    });

    it('... should put `undefined` at the end', () => {
        const collection = [{ a: { b: 3 } }, { a: { b: 1 } }, { a: undefined }, { a: { b: 2 } }];

        const result = [{ a: { b: 1 } }, { a: { b: 2 } }, { a: { b: 3 } }, { a: undefined }];

        expectToEqual(pipe.transform(collection, 'a.b'), result);
    });

    describe('number-like strings', () => {
        it('... should compare two number-like strings', () => {
            const el1 = '1';
            const el2 = '10';
            const arr = [el2, el1];
            const res = [el1, el2];

            expectToEqual(pipe.transform(arr), res);
        });

        it('... should compare two number-like strings with commas', () => {
            const el1 = '$299,000';
            const el2 = '$1,100,000';
            const arr = [el2, el1];

            expectToEqual(pipe.transform(arr), arr);
        });
    });

    describe('order with comparator', () => {
        it('... should return same order with "0"-comparator', () => {
            const arr = [3, 2, 1];

            expectToEqual(
                pipe.transform(arr, null, false, true, () => 0),
                arr
            );
        });

        it('... should change the order with custom comparator', () => {
            const arr = [3, 2, 1];
            const res = [1, 2, 3];

            expectToEqual(
                pipe.transform(arr, null, false, true, (a, b) => (a > b ? 1 : -1)),
                res
            );
        });

        it('... should return change to order with custom comparator', () => {
            const arr = ['$10,0', '$2,0', '$100,0'];
            const res = ['$2,0', '$10,0', '$100,0'];

            const parse = value => parseInt(value.replace(/[^0-9]/g, ''), 10);

            expect(
                pipe.transform(arr, null, false, true, (a, b) => {
                    const newA = parse(a);
                    const newB = parse(b);
                    return newA > newB ? 1 : -1;
                })
            ).toEqual(res);
        });

        describe('test not valid values for comparator', () => {
            const arr = [3, 2, 1];
            const res = [1, 2, 3];

            it('... should still work if comparator is null', () => {
                expectToEqual(pipe.transform(arr, null, false, true, null), res);
            });

            it('... should still work if comparator is undefined', () => {
                expectToEqual(pipe.transform(arr, null, false, true, undefined), res);
                expectToEqual(pipe.transform(arr, null, false, true, void 0), res);
            });

            it('... should still work if comparator is not returning anything', () => {
                expectToEqual(
                    pipe.transform(arr, null, false, true, () => {}),
                    arr
                );
            });
        });
    });

    describe('multi field sort', () => {
        it('... should sort by multiple fields', () => {
            const array = [
                { name: 'qwe', age: 1 },
                { name: 'asd', age: 3 },
                { name: 'asd', age: 2 },
            ];

            const result = [
                { name: 'asd', age: 2 },
                { name: 'asd', age: 3 },
                { name: 'qwe', age: 1 },
            ];

            expectToEqual(pipe.transform(array, ['name', 'age']), result);
        });

        it('... should sort by multiple fields with case-insensitivity', () => {
            const array = [
                { name: 'qwe', age: 1 },
                { name: 'asd', age: 3 },
                { name: 'Asd', age: 2 },
            ];

            const result = [
                { name: 'asd', age: 3 },
                { name: 'Asd', age: 2 },
                { name: 'qwe', age: 1 },
            ];

            expectToEqual(pipe.transform(array, ['name', 'age'], false, true), result);
        });

        it('... should sort by multiple fields with case-sensitivity', () => {
            const array = [
                { name: 'qwe', age: 1 },
                { name: 'asd', age: 3 },
                { name: 'Asd', age: 2 },
            ];

            const result = [
                { name: 'Asd', age: 2 },
                { name: 'asd', age: 3 },
                { name: 'qwe', age: 1 },
            ];

            expectToEqual(pipe.transform(array, ['name', 'age'], false, false), result);
        });

        it('... should sort by multiple fields with case-sensitivity by default', () => {
            const array = [
                { name: 'qwe', age: 1 },
                { name: 'asd', age: 3 },
                { name: 'Asd', age: 2 },
            ];

            const result = [
                { name: 'Asd', age: 2 },
                { name: 'asd', age: 3 },
                { name: 'qwe', age: 1 },
            ];

            expectToEqual(pipe.transform(array, ['name', 'age'], false, undefined), result);
        });

        describe('preserve sorting order', () => {
            const array = [
                { group: 1, value: 2 },
                { group: 1, value: 1 },
                { group: 3, value: 1 },
                { group: 2, value: 2 },
                { group: 2, value: 1 },
            ];

            it('... should sort by multiple fields and preserve priority', () => {
                const result = [
                    { group: 1, value: 1 },
                    { group: 1, value: 2 },
                    { group: 2, value: 1 },
                    { group: 2, value: 2 },
                    { group: 3, value: 1 },
                ];

                expectToEqual(pipe.transform(array, ['group', 'value']), result);
            });

            it('... should sort by multiple fields and preserve priority (reversed)', () => {
                const result = [
                    { group: 1, value: 1 },
                    { group: 2, value: 1 },
                    { group: 3, value: 1 },
                    { group: 1, value: 2 },
                    { group: 2, value: 2 },
                ];

                expectToEqual(pipe.transform(array, ['value', 'group']), result);
            });
        });

        it('... should keep the same order if no sort fields are given', () => {
            const array = [
                { name: 'q', age: 1 },
                { name: 'a', age: 3 },
                { name: 'a', age: 2 },
            ];

            expectToEqual(pipe.transform(array, []), array);
        });

        it('... should not modify original array', () => {
            const array = [
                { key: 'a', value: 3 },
                { key: 'a', value: 1 },
            ];

            const result = [
                { key: 'a', value: 1 },
                { key: 'a', value: 3 },
            ];

            expectToEqual(pipe.transform(array, ['key', 'value']), result);
            expectToEqual(array[0], { key: 'a', value: 3 });
            expectToEqual(array[1], { key: 'a', value: 1 });
        });
    });

    describe('Booleans', () => {
        it('... should return same simple false array', () => {
            const array = [{ value: false }];
            expectToEqual(pipe.transform(array, 'value'), array);
        });

        it('... should return same simple true array', () => {
            const array = [{ value: true }];
            expectToEqual(pipe.transform(array, 'value'), array);
        });

        it('... should return sorted booleans as it is', () => {
            const array = [{ value: false }, { value: true }];
            expectToEqual(pipe.transform(array, 'value'), array);
        });

        it('... should sort booleans', () => {
            const array = [{ value: true }, { value: false }];
            const arraySorted = [{ value: false }, { value: true }];
            expectToEqual(pipe.transform(array, 'value'), arraySorted);
        });
    });

    describe('Dates', () => {
        it('... should sort different dates', () => {
            const a = { createdAt: new Date(1980, 11, 1, 0, 0, 0, 0) };
            const b = { createdAt: new Date(1980, 8, 2, 0, 0, 0, 0) };
            const c = { createdAt: new Date(1980, 10, 3, 0, 0, 0, 0) };
            const collection = [a, b, c];
            const result = [b, c, a];

            expectToEqual(pipe.transform(collection, 'createdAt'), result);
        });

        it('... should sort dates', () => {
            const a = { id: 1, info: { date: new Date(1980, 11, 31, 0, 0, 0, 0) } };
            const b = { id: 2, info: { date: new Date(1985, 8, 3, 0, 0, 0, 0) } };
            const c = { id: 3, info: { date: new Date(1978, 10, 12, 0, 0, 0, 0) } };
            const collection = [a, b, c];

            const result = [c, a, b];

            expectToEqual(pipe.transform(collection, 'info.date'), result);
            expectToEqual(pipe.transform(collection, 'info.date', true), result.reverse());
        });

        it('... should sort dates also including null as date', () => {
            const a = { date: new Date(1980, 11, 31, 0, 0, 0, 0) };
            const b = { date: null };
            const c = { date: new Date(1978, 10, 12, 0, 0, 0, 0) };

            const collection = [a, b, c];
            const result = [c, a, b];

            expectToEqual(pipe.transform(collection, 'date'), result);
            expectToEqual(pipe.transform(collection, 'date', true), result.reverse());
        });

        describe('multisort with dates', () => {
            it('... should sort dates equal dates', () => {
                const a = {
                    info: { name: 'Adam', date: new Date(1978, 10, 12, 0, 0, 0, 0) },
                };
                const b = {
                    info: { name: 'Julie', date: new Date(1978, 10, 12, 0, 0, 0, 0) },
                };
                const collection = [b, a];

                const result = [a, b];

                expectToEqual(pipe.transform(collection, ['info.date', 'info.name']), result);
                expectToEqual(pipe.transform(collection, ['info.date', 'info.name'], true), result);
            });

            it('... should sort dates different dates', () => {
                const a = {
                    info: { name: 'Adam', date: new Date(1970, 10, 12, 0, 0, 0, 0) },
                };
                const b = {
                    info: { name: 'Julie', date: new Date(1970, 11, 15, 0, 0, 0, 0) },
                };
                const c = {
                    info: { name: 'Julie', date: new Date(1970, 8, 15, 0, 0, 0, 0) },
                };
                const collection = [b, a, c];

                const result = [c, a, b];

                expectToEqual(pipe.transform(collection, ['info.date', 'info.name']), result);
                expectToEqual(pipe.transform(collection, ['info.date', 'info.name'], true), [b, a, c]);
            });
        });
    });
});
