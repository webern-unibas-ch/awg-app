import { OrderByPipe } from './order-by.pipe';

describe('OrderByPipe (DONE)', () => {
    let orderByPipe: OrderByPipe;

    let testArray;
    let testEqualArray;
    let expectedAscArray;
    let expectedDescArray;
    let expectedEqualArray;
    let expectedUnchangedArray;

    beforeEach(() => {
        orderByPipe = new OrderByPipe();

        // testData
        testArray = [{ obj_id: 4 }, { obj_id: 7 }, { obj_id: 3 }, { obj_id: 1 }];
        testEqualArray = [{ obj_id: 7 }, { obj_id: 4 }, { obj_id: 1 }, { obj_id: 7 }];
        expectedEqualArray = [{ obj_id: 1 }, { obj_id: 4 }, { obj_id: 7 }, { obj_id: 7 }];
        expectedUnchangedArray = [{ obj_id: 4 }, { obj_id: 7 }, { obj_id: 3 }, { obj_id: 1 }];
        expectedAscArray = [{ obj_id: 1 }, { obj_id: 3 }, { obj_id: 4 }, { obj_id: 7 }];
        expectedDescArray = [{ obj_id: 7 }, { obj_id: 4 }, { obj_id: 3 }, { obj_id: 1 }];
    });

    it('should create an instance', () => {
        expect(orderByPipe).toBeTruthy();
    });

    it('should return empty array if no value provided', () => {
        expect(orderByPipe.transform([], '')).toEqual([], 'should return empty array');
    });

    it('should stay unchanged if no sort property provided', () => {
        let args = { direction: 1 };
        let pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).toEqual(expectedUnchangedArray, 'should be unchanged');

        // change direction
        args = { direction: -1 };
        pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).toEqual(expectedUnchangedArray, 'should be unchanged');
    });

    it('should sort by ascending values per default (no direction provided)', () => {
        const args = { property: 'obj_id' };
        const pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).not.toEqual(expectedUnchangedArray, 'should not be unchanged');
        expect(pipedTestArray).not.toEqual(expectedDescArray, 'should not be sorted descending');
        expect(pipedTestArray).toEqual(expectedAscArray, 'should be sorted ascending');
    });

    it('should sort by ascending values if direction has positive value or 0', () => {
        let args = { property: 'obj_id', direction: 1 };
        let pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).toEqual(expectedAscArray, 'should be sorted ascending');

        // reset testArray
        testArray = [{ obj_id: 4 }, { obj_id: 7 }, { obj_id: 3 }, { obj_id: 1 }];

        // change to any positive value
        args = { property: 'obj_id', direction: 99 };
        pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).toEqual(expectedAscArray, 'should be sorted ascending');

        // reset testArray
        testArray = [{ obj_id: 4 }, { obj_id: 7 }, { obj_id: 3 }, { obj_id: 1 }];

        // change to 0
        args = { property: 'obj_id', direction: 0 };
        pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).toEqual(expectedAscArray, 'should be sorted ascending');
    });

    it('should sort by descending values if direction has negative value', () => {
        let args = { property: 'obj_id', direction: -1 };
        let pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).toEqual(expectedDescArray, 'should be sorted descending');

        // reset testArray
        testArray = [{ obj_id: 4 }, { obj_id: 7 }, { obj_id: 3 }, { obj_id: 1 }];

        // change to any negative value
        args = { property: 'obj_id', direction: -99 };
        pipedTestArray = orderByPipe.transform(testArray, args);

        expect(pipedTestArray).toEqual(expectedDescArray, 'should be sorted descending');
    });

    it('should sort equal values correctly', () => {
        const args = { property: 'obj_id', direction: 1 };
        const pipedTestArray = orderByPipe.transform(testEqualArray, args);

        expect(pipedTestArray).toEqual(expectedEqualArray, 'should be have equal values sorted correctly');
    });
});
