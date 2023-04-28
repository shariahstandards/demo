import { render, screen } from '@testing-library/react';
import { QuranConcordance, Surahs } from './QuranService';
describe("Given an English QuranConcordance",()=>{
    var surahs:Surahs={
        "1":[
            {
                chapter:1,
                verse:1,
                text:"An example, verse with some text"
            },
            {
                chapter:1,
                verse:1,
                text:"some other text"
            }
        ]
    }
    let quranConcordance=new QuranConcordance(surahs,"English");
    describe("When searching for a word found in a verse",()=>{
        var searchResults=quranConcordance.search("example");
        test("there is a search result",()=>{
            expect(searchResults.searchResultGroups.length).toBe(1);
            expect(searchResults.searchResultGroups[0].searchResults.length).toBe(1);
        })
    })
    describe("When searching for text found only in part of a word in a verse",()=>{
        var searchResults=quranConcordance.search("ample");
        test("there is no search result",()=>{
            expect(searchResults.searchResultGroups.length).toBe(0);
        })
    })
    describe("when searching for multimple words found in the verse",()=>{
        var searchResults=quranConcordance.search("example some");
        test("there is one search result group",()=>{
            expect(searchResults.searchResultGroups.length).toBe(1);
        })
        test("there are one search result",()=>{
            expect(searchResults.searchResultGroups[0].searchResults.length).toBe(1)
        })
        test("there are two highlighted words",()=>{
            expect(searchResults.searchResultGroups[0].searchResults[0].matchingWordNumbers.length).toBe(2);
            expect(searchResults.searchResultGroups[0].searchResults[0].matchingWordNumbers[0]).toBe(2);
            expect(searchResults.searchResultGroups[0].searchResults[0].matchingWordNumbers[1]).toBe(5);
            expect(searchResults.searchResultGroups[0].searchResults[0].searchResultVerseWords.filter(x=>x.highlight).length).toBe(2);
            expect(searchResults.searchResultGroups[0].searchResults[0].searchResultVerseWords.filter(x=>x.highlight)[0].word).toBe("example,");
            expect(searchResults.searchResultGroups[0].searchResults[0].searchResultVerseWords.filter(x=>x.highlight)[1].word).toBe("some");
        })
    })
})