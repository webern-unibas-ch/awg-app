/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { mockSearchResponseJson } from '@testing/mock-data';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { AppModule } from '@awg-app/app.module';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    let conversionService: ConversionService;

    let convertStandoffToHTMLSpy: Spy;
    let replaceParagraphTagsSpy: Spy;
    let replaceSalsahLinkSpy: Spy;

    // TODO: add APP_BASE_HREF , see https://angular.io/api/common/APP_BASE_HREF

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [ConversionService],
        });
        conversionService = TestBed.inject(ConversionService);

        // Spies for service methods
        replaceParagraphTagsSpy = spyOn(ConversionService, 'replaceParagraphTags').and.callThrough();

        replaceSalsahLinkSpy = spyOn<any>(conversionService, '_replaceSalsahLink').and.callThrough();
        convertStandoffToHTMLSpy = spyOn<any>(conversionService, '_convertStandoffToHTML').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(conversionService).toBeTruthy();
    });

    it('... should not have filteredOut before convertFullTextSearchResults call', () => {
        expect(conversionService.filteredOut).toBeUndefined();

        conversionService.convertFullTextSearchResults(mockSearchResponseJson);

        expect(conversionService.filteredOut).toBeDefined();
    });

    describe('#replaceParagraphTags', () => {
        it('... should have a static method `replaceParagraphTags`', () => {
            expect(ConversionService.replaceParagraphTags).toBeDefined();
        });

        it('... should replace paragraph tags correctly', () => {
            const str = `<p>Hello World</p>`;
            const expected = `Hello World`;

            const result = ConversionService.replaceParagraphTags(str);

            expectToBe(result, expected);
        });

        it('... should add line breaks correctly', () => {
            const str = `<p>Hello</p><p>World</p>`;
            const expected = `Hello<br class="mb-2" />World`;

            const result = ConversionService.replaceParagraphTags(str);

            expectToBe(result, expected);
        });

        it('... should return undefined if input is falsy', () => {
            const str = undefined;

            const result = ConversionService.replaceParagraphTags(str);

            expect(result).toBeUndefined();
        });
    });

    describe('#prepareFullTextSearchResultText', () => {
        it('... should have a method `prepareFullTextSearchResultText`', () => {
            expect(conversionService.prepareFullTextSearchResultText).toBeDefined();
        });

        describe('... should return an error message if', () => {
            it('... subjects are undefined', () => {
                const searchUrl = 'http://example.com';
                const emptySearchResponseWithQuery = new SearchResponseWithQuery(
                    JSON.parse(JSON.stringify(mockSearchResponseJson)),
                    'Test'
                );
                emptySearchResponseWithQuery.data.subjects = undefined;
                const expected = `Die Abfrage ${searchUrl} ist leider fehlgeschlagen. Wiederholen Sie die Abfrage zu einem späteren Zeitpunkt oder überprüfen sie die Suchbegriffe.`;

                const result = conversionService.prepareFullTextSearchResultText(
                    emptySearchResponseWithQuery,
                    searchUrl
                );

                expectToBe(result, expected);
            });

            it('... subjects are null', () => {
                const searchUrl = 'http://example.com';
                const emptySearchResponseWithQuery = new SearchResponseWithQuery(
                    JSON.parse(JSON.stringify(mockSearchResponseJson)),
                    'Test'
                );
                emptySearchResponseWithQuery.data.subjects = null;
                const expected = `Die Abfrage ${searchUrl} ist leider fehlgeschlagen. Wiederholen Sie die Abfrage zu einem späteren Zeitpunkt oder überprüfen sie die Suchbegriffe.`;

                const result = conversionService.prepareFullTextSearchResultText(
                    emptySearchResponseWithQuery,
                    searchUrl
                );

                expectToBe(result, expected);
            });
        });

        it('... should return a string', () => {
            const searchUrl = 'http://example.com';
            const searchResponseWithQuery = new SearchResponseWithQuery(
                JSON.parse(JSON.stringify(mockSearchResponseJson)),
                'Test'
            );

            const result = conversionService.prepareFullTextSearchResultText(searchResponseWithQuery, searchUrl);

            expect(typeof result).toEqual('string');
        });

        describe('... should return correct text', () => {
            it('... for no results (default value for nhits = 0)', () => {
                const searchUrl = 'http://example.com';
                const searchResponseWithQuery = new SearchResponseWithQuery(
                    JSON.parse(JSON.stringify(mockSearchResponseJson)),
                    'Test'
                );
                searchResponseWithQuery.data.subjects = [];
                searchResponseWithQuery.data.nhits = undefined;
                const subjectsLength = searchResponseWithQuery.data.subjects.length;
                const expected = `0 / 0 Ergebnisse`;

                const result = conversionService.prepareFullTextSearchResultText(searchResponseWithQuery, searchUrl);

                expectToBe(result, expected);
            });

            it('... for a single result', () => {
                const searchUrl = 'http://example.com';
                const searchResponseWithQuery = new SearchResponseWithQuery(
                    JSON.parse(JSON.stringify(mockSearchResponseJson)),
                    'Test'
                );
                searchResponseWithQuery.data.subjects = [mockSearchResponseJson.subjects[0]];
                searchResponseWithQuery.data.nhits = '1';
                const expected = `1 / 1 Ergebnis`;

                const result = conversionService.prepareFullTextSearchResultText(searchResponseWithQuery, searchUrl);

                expectToBe(result, expected);
            });

            it('... for multiple results', () => {
                const searchUrl = 'http://example.com';
                const searchResponseWithQuery = new SearchResponseWithQuery(
                    JSON.parse(JSON.stringify(mockSearchResponseJson)),
                    'Test'
                );
                const subjectsLength = searchResponseWithQuery.data.subjects.length;
                const expected = `${subjectsLength} / ${searchResponseWithQuery.data.nhits} Ergebnisse`;

                const result = conversionService.prepareFullTextSearchResultText(searchResponseWithQuery, searchUrl);

                expectToBe(result, expected);
            });

            it('... for multiple results with single duplicate filtered out', () => {
                conversionService.filteredOut = 1;

                const searchUrl = 'http://example.com';
                const searchResponseWithQuery = new SearchResponseWithQuery(
                    JSON.parse(JSON.stringify(mockSearchResponseJson)),
                    'Test'
                );
                const subjectsLength = searchResponseWithQuery.data.subjects.length;
                const expected = `${subjectsLength} / ${searchResponseWithQuery.data.nhits} Ergebnisse (1 Duplikat entfernt)`;

                const result = conversionService.prepareFullTextSearchResultText(searchResponseWithQuery, searchUrl);

                expectToBe(result, expected);
            });

            it('... for multiple results with multiple duplicates filtered out', () => {
                conversionService.filteredOut = 2;

                const searchUrl = 'http://example.com';
                const searchResponseWithQuery = new SearchResponseWithQuery(
                    JSON.parse(JSON.stringify(mockSearchResponseJson)),
                    'Test'
                );
                const subjectsLength = searchResponseWithQuery.data.subjects.length;
                const expected = `${subjectsLength} / ${searchResponseWithQuery.data.nhits} Ergebnisse (2 Duplikate entfernt)`;

                const result = conversionService.prepareFullTextSearchResultText(searchResponseWithQuery, searchUrl);

                expectToBe(result, expected);
            });
        });
    });

    describe('#_convertRichtextValue', () => {
        it('... should have a method `_convertRichtextValue`', () => {
            expect((conversionService as any)._convertRichtextValue).toBeDefined();
        });

        it('... should trigger `_convertStandoffToHTML`', () => {
            const str = `A test string.`;
            const jsonAttrs = {
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 14 }],
            };
            const expected = [str, JSON.stringify(jsonAttrs)];

            (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expectSpyCall(convertStandoffToHTMLSpy, 1, expected);
        });

        it('... should trigger `_replaceSalsahLink`', () => {
            const str = `A test string.`;
            const jsonAttrs = {
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 14 }],
            };
            const expected = `<p>A <em>test</em> string.</p>`;

            (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expectSpyCall(replaceSalsahLinkSpy, 1, expected);
        });

        it('... should trigger `replaceParagraphTags`', () => {
            const str = `A test string.`;
            const jsonAttrs = {
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 14 }],
            };
            const expected = `<p>A <em>test</em> string.</p>`;

            (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expectSpyCall(replaceParagraphTagsSpy, 1, expected);
        });

        describe('... should return undefined', () => {
            it('... when the input string is empty', () => {
                const str = '';
                const jsonAttrs = { italic: [{ start: 5, end: 9 }] };

                const result = (conversionService as any)._convertRichtextValue(str, jsonAttrs);

                expect(result).toBeUndefined();
            });

            it('... when the input string is null or undefined', () => {
                const str = null;
                const jsonAttrs = { italic: [{ start: 5, end: 9 }] };

                const result = (conversionService as any)._convertRichtextValue(str, jsonAttrs);

                expect(result).toBeUndefined();
            });
        });

        it('... should return the original string if no attributes are given', () => {
            const str = `A test string without attributes.`;
            const jsonAttrs = undefined;
            const expected = 'A test string without attributes.';

            const result = (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expectToBe(result, expected);
        });

        it('... should return a string', () => {
            const str = `A test string.`;
            const jsonAttrs = {
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 14 }],
            };

            const result = (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expect(typeof result).toEqual('string');
        });

        it('... should correctly convert a rich text value with Standoff to HTML', () => {
            const str = `A test string.`;
            const jsonAttrs = {
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 14 }],
            };
            const expected = `A <em>test</em> string.`;

            const result = (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expectToBe(result, expected);
        });

        it('... should correctly replace salsah links', () => {
            const str = `A test string with a link.`;
            const jsonAttrs = {
                _link: [{ start: 21, end: 25, href: 'http://www.salsah.org/api/resources/11690', resid: '11690' }],
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 26 }],
            };
            const expected = `A <em>test</em> string with a <a (click)="ref.navigateToResource('11690'); $event.stopPropagation()">link</a>.`;

            const result = (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expectToBe(result, expected);
            expect(result).not.toContain(`class="salsah"`);
        });

        it('... should correctly replace paragraph tags', () => {
            const str = `<p>A test string with p-tags.</p>`;
            const jsonAttrs = { italic: [{ start: 5, end: 9 }] };
            const expected = `A <em>test</em> string with p-tags.`;

            const result = (conversionService as any)._convertRichtextValue(str, JSON.stringify(jsonAttrs));

            expectToBe(result, expected);
        });
    });

    describe('#_convertStandoffToHTML', () => {
        it('... should have a method `_convertStandoffToHTML`', () => {
            expect((conversionService as any)._convertStandoffToHTML).toBeDefined();
        });

        describe('... should return undefined', () => {
            it('... when the input string is empty', () => {
                const str = '';
                const jsonAttrs = { italic: [{ start: 5, end: 9 }] };

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expect(result).toBeUndefined();
            });

            it('... when the input string is null or undefined', () => {
                const str = null;
                const jsonAttrs = { italic: [{ start: 5, end: 9 }] };

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expect(result).toBeUndefined();
            });
        });

        it('... should return the original string if no attributes are given', () => {
            const str = `A test string without attributes.`;
            const jsonAttrs = undefined;
            const expected = 'A test string without attributes.';

            const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

            expectToBe(result, expected);
        });

        it('... should return a string', () => {
            const str = `A test string.`;
            const jsonAttrs = {
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 14 }],
            };

            const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

            expect(typeof result).toEqual('string');
        });

        it('... should correctly convert a rich text value with Standoff to HTML', () => {
            const str = `A test string.`;
            const jsonAttrs = {
                italic: [{ start: 2, end: 6 }],
                p: [{ start: 0, end: 14 }],
            };
            const expected = `<p>A <em>test</em> string.</p>`;

            const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

            expectToBe(result, expected);
        });

        describe('... should correctly convert standoff to HTML tags', () => {
            it('... bold --> strong', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    bold: [{ start: 2, end: 6 }],
                };
                const expected = `A <strong>test</strong> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... underline --> u', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    underline: [{ start: 2, end: 6 }],
                };
                const expected = `A <u>test</u> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... strikethrough --> s', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    strikethrough: [{ start: 2, end: 6 }],
                };
                const expected = `A <s>test</s> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... italic --> em', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    italic: [{ start: 2, end: 6 }],
                };
                const expected = `A <em>test</em> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... h1 --> h1', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    h1: [{ start: 2, end: 6 }],
                };
                const expected = `A <h1>test</h1> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... h2 --> h2', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    h2: [{ start: 2, end: 6 }],
                };
                const expected = `A <h2>test</h2> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... h3 --> h3', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    h3: [{ start: 2, end: 6 }],
                };
                const expected = `A <h3>test</h3> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... h4 --> h4', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    h4: [{ start: 2, end: 6 }],
                };
                const expected = `A <h4>test</h4> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... h5 --> h5', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    h5: [{ start: 2, end: 6 }],
                };
                const expected = `A <h5>test</h5> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... h6 --> h6', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    h6: [{ start: 2, end: 6 }],
                };
                const expected = `A <h6>test</h6> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... ol --> ol', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    ol: [{ start: 2, end: 6 }],
                };
                const expected = `A <ol>test</ol> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... ul --> ul', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    ul: [{ start: 2, end: 6 }],
                };
                const expected = `A <ul>test</ul> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... li --> li', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    li: [{ start: 2, end: 6 }],
                };
                const expected = `A <li>test</li> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });

            it('... style --> span', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    style: [{ start: 2, end: 6 }],
                };
                const expected = `A <span style="undefined">test</span> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToEqual(result, expected);
            });

            it('... p --> p', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    p: [{ start: 2, end: 6 }],
                };
                const expected = `A <p>test</p> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToEqual(result, expected);
            });

            it('... sup --> sup', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    sup: [{ start: 2, end: 6 }],
                };
                const expected = `A <sup>test</sup> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToEqual(result, expected);
            });

            it('... sub --> sub', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    sub: [{ start: 2, end: 6 }],
                };
                const expected = `A <sub>test</sub> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToEqual(result, expected);
            });

            it('... _link --> a', () => {
                const str = `A test string.`;
                const jsonAttrs = {
                    _link: [{ start: 2, end: 6, href: 'http://www.salsah.org/api/resources/54623', resid: '54623' }],
                };
                const expected = `A <a href="http://www.salsah.org/api/resources/54623" class="salsah-link">test</a> string.`;

                const result = (conversionService as any)._convertStandoffToHTML(str, JSON.stringify(jsonAttrs));

                expectToBe(result, expected);
            });
        });
    });

    describe('#_replaceSalsahLink', () => {
        it('... should have a method `_replaceSalsahLink`', () => {
            expect((conversionService as any)._replaceSalsahLink).toBeDefined();
        });

        describe('... should return undefined', () => {
            it('... when the input string is empty', () => {
                const str = '';

                const result = (conversionService as any)._replaceSalsahLink(str);

                expect(result).toBeUndefined();
            });

            it('... when the input string is null or undefined', () => {
                const str = null;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expect(result).toBeUndefined();
            });
        });

        describe('... should return the original string if', () => {
            it('... there are no links', () => {
                const str = `A test string without any links.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, str);
            });

            it('... there are no salsah links', () => {
                const str = `A test string with an <a href="https://www.example.com">Example link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, str);
            });
        });

        describe('... should correctly replace salsah links', () => {
            it('... starting with https', () => {
                const str = `A test string with a <a href="https://salsah.org/api/resources/11690" class="salsah-link">Salsah link</a>.`;
                const expected = `A test string with a <a (click)="ref.navigateToResource('11690'); $event.stopPropagation()">Salsah link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, expected);
            });

            it('... starting with `https://www.`', () => {
                const str = `A test string with a <a href="https://www.salsah.org/api/resources/11690" class="salsah-link">Salsah link</a>.`;
                const expected = `A test string with a <a (click)="ref.navigateToResource('11690'); $event.stopPropagation()">Salsah link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, expected);
            });

            it('... starting with http', () => {
                const str = `A test string with a <a href="http://salsah.org/api/resources/11690" class="salsah-link">Salsah link</a>.`;
                const expected = `A test string with a <a (click)="ref.navigateToResource('11690'); $event.stopPropagation()">Salsah link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, expected);
            });

            it('... starting with `http://www.`', () => {
                const str = `A test string with a <a href="http://www.salsah.org/api/resources/11690" class="salsah-link">Salsah link</a>.`;
                const expected = `A test string with a <a (click)="ref.navigateToResource('11690'); $event.stopPropagation()">Salsah link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, expected);
            });

            it('... with multiple salsah links', () => {
                const str = `A test string with a <a href="https://salsah.org/api/resources/11690" class="salsah-link">Salsah link</a> and another <a href="https://salsah.org/api/resources/11691" class="salsah-link">Salsah link</a>.`;
                const expected = `A test string with a <a (click)="ref.navigateToResource('11690'); $event.stopPropagation()">Salsah link</a> and another <a (click)="ref.navigateToResource('11691'); $event.stopPropagation()">Salsah link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, expected);
            });

            it('... with small resource ids', () => {
                const str = `A test string with a <a href="https://salsah.org/api/resources/1" class="salsah-link">Salsah link</a>.`;
                const expected = `A test string with a <a (click)="ref.navigateToResource('1'); $event.stopPropagation()">Salsah link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, expected);
            });

            it('... with large resource ids', () => {
                const str = `A test string with a <a href="https://salsah.org/api/resources/123456789012" class="salsah-link">Salsah link</a>.`;
                const expected = `A test string with a <a (click)="ref.navigateToResource('123456789012'); $event.stopPropagation()">Salsah link</a>.`;

                const result = (conversionService as any)._replaceSalsahLink(str);

                expectToBe(result, expected);
            });
        });
    });
});
