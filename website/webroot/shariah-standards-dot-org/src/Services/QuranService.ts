import { create } from 'zustand'
import { Guid } from '../Compnents/Guid';

const quranDataUrlBase="https://quraniclaw.net/data/";
export interface Ayah {
    chapter: number;
    verse: number;
    text: string;
}
export interface Surahs {
    [id: string]: Ayah[];
}

export interface QuranState{
    load:()=>void,
    quranTools:QuranTools|undefined
}
export interface ChapterDetails {
    id: number;
    name: string;
    transliteration: string;
    translation: string;
    type: string;
    total_verses: number;
}

export interface SearchResults{
    searchResultGroups:SearchResultGroup[]
}
export interface QuranTools{
    arabicQuran:Surahs,
    englishQuran:Surahs,
    chapterDetails:ChapterDetails[],
    arabicConcordance: QuranConcordance,
    englishConcordance: QuranConcordance
}
export interface QuranWordReference{
    surahNumber:number,
    ayahNumber:number,
    wordNumber:number
}
export interface SearchResultVerseWords{
    word:string,
    highlight:boolean,
    id:string
}
export interface SearchResult{
    surahNumber:number,
    ayahNumber:number,
    matchingWordNumbers:number[]
    searchResultVerseWords:SearchResultVerseWords[],
    resultNumber:number,
    id:string
}
export class QuranConcordance{
    allLetters(): string[] {
        return this.allCharacters;
    }
    entries:{[id:string]:QuranWordReference[]}={};
    allAyahs:Ayah[]=[];
    constructor(public surahs:Surahs,public language:string)
    {
        
        Object.getOwnPropertyNames(surahs).forEach(surahNumber=> 
            this.allAyahs=this.allAyahs.concat(surahs[surahNumber])
        );
        this.allAyahs.forEach(verse=>{
            var words=this.getWords(verse.text);
            words.forEach((word,wordIndex)=>{
                let reference:QuranWordReference={
                    ayahNumber:verse.verse,
                    surahNumber:verse.chapter,
                    wordNumber:(wordIndex+1)
                }
                if(!this.entries[word]){
                    this.entries[word]=[reference];
                }else{
                    this.entries[word].push(reference);
                }
            });
        });

        Object.getOwnPropertyNames(this.entries).forEach(word=>{
            var chars=word.split('');
            chars.forEach(c=>{
                if(this.allCharacters.indexOf(c)<0){
                    this.allCharacters.push(c)
                }
            });
        })
    }
    allCharacters:string[]=[]
    getWords(searchText:string):string[]{
        return searchText.split(/["[\];:'?!,.\s]/).filter(x=>x!=="");
    }
    arabicAllowedExtraLetters:string[]=[]
    strongArabicConsonants:string[]="ضصثقفغعهخحجدذشسبلتنمكطؤءرةظز".split('');
    isArabicWordMatch(word:string,entry:string){
        var entryPosition=0;
        for(var wordCharIndex=0;wordCharIndex<word.length;wordCharIndex++)
        {
            var char=word[wordCharIndex];
            var nextCharPosition=entry.indexOf(char,entryPosition);
            if(nextCharPosition<entryPosition){
                return false;
            }

            entryPosition=nextCharPosition;
        }
        var wordFirstChar = word[0];
        var firstCharFirstEntryMatchIndex = entry.indexOf(wordFirstChar);
        var lastCharLastEntryMatchIndex = entryPosition;
        if(firstCharFirstEntryMatchIndex<0){return false;}
        if(lastCharLastEntryMatchIndex<0){return false;}
        if(lastCharLastEntryMatchIndex<=firstCharFirstEntryMatchIndex) {return false;}
        var wordInMiddleOfEntry = entry.substring(firstCharFirstEntryMatchIndex,lastCharLastEntryMatchIndex);

        var forbiddenLetters = this.strongArabicConsonants.filter(letter=>{
            return (word.indexOf(letter)<0);
        })
        var foundForbiddenExtraConsonant=false;
        wordInMiddleOfEntry.split('').forEach(letter=>{
            if(forbiddenLetters.indexOf(letter)>=0){
                foundForbiddenExtraConsonant=true;
            }
        })
        if(foundForbiddenExtraConsonant){return false;}

        return true;
        
    }

    matchWord(word:string,entry:string):boolean{
        switch(this.language){
            case "Arabic":
                return this.isArabicWordMatch(word,entry);
            case "English":
            default:
                return entry.toLowerCase().startsWith(word.toLowerCase());
        }
    }
    search(searchText:string):SearchResults{

        var words=this.getWords(searchText);
        var resultsGroups:SearchResultGroup[]=[];

        var wordMatchGroups = words.map(word=>{
            return Object.getOwnPropertyNames(this.entries).filter(entry=>this.matchWord(word,entry));
        });
        let wordMatchPermutations:string[][]=wordMatchGroups[0].map(x=>[x]);
        for(var wordSetIndex=1;wordSetIndex<wordMatchGroups.length;wordSetIndex++)
        {
            var nextWordSet=wordMatchGroups[wordSetIndex];
            var newPermutations:string[][] = [];
            for(var oldPermutationIndex=0;oldPermutationIndex<wordMatchPermutations.length;oldPermutationIndex++){
                var oldPermutationValues:string[] = wordMatchPermutations[oldPermutationIndex];
                
                for(var nextWordIndex=0;nextWordIndex<nextWordSet.length;nextWordIndex++){
                    var nextWordInPermutation=nextWordSet[nextWordIndex];
                    newPermutations.push(oldPermutationValues.concat([nextWordInPermutation]))
                }
            }
            wordMatchPermutations=newPermutations;
        }
        // wordMatchPermutations=wordMatchGroups.reduce((wordMatchPermutations,wordMatchList)=>{
        //     if(wordMatchPermutations.length===0){
        //         wordMatchPermutations=wordMatchList.map(x=>[x])
        //     }else{
        //         wordMatchPermutations=wordMatchList.map(nextWordMatch=>wordMatchPermutations.concat([nextWordMatch]))
        //     }
        // },wordMatchPermutations)
        resultsGroups= wordMatchPermutations.map(permutation=>{
            return{
                matchedWords:permutation,
                searchResults:[],
                id:Guid.create()
            }
        })
            
        resultsGroups.forEach(group=>{
            var searchResults:SearchResult[]=[];

            group.matchedWords.forEach((matchedWord, matchedWordIndex)=>{
                if(matchedWordIndex===0){
                    searchResults=this.entries[matchedWord].map(entry=>{return{
                        surahNumber:entry.surahNumber,
                        ayahNumber:entry.ayahNumber,
                        matchingWordNumbers:[entry.wordNumber],
                        searchResultVerseWords:[],
                        resultNumber:0,
                        id:Guid.create()
                    }})
                }else{
                    searchResults=this.combineWithLaterWordMatches(searchResults,this.entries[matchedWord]);
                }
            })
            searchResults.forEach((searchResult,index)=>{
                searchResult.searchResultVerseWords = 
                    this.surahs[searchResult.surahNumber.toString()][searchResult.ayahNumber-1].text.split(' ')
                        .filter(x=>x!=='')
                        .map((word,wordIndex)=>{return {
                            highlight:searchResult.matchingWordNumbers.some(x=>x===(wordIndex+1)),
                            word:word,
                            id:Guid.create()
                        }});
                    searchResult.resultNumber=(index+1);
            })
            group.searchResults = searchResults;
        });
        resultsGroups=resultsGroups.filter(x=>x.searchResults.length>0);
        resultsGroups=resultsGroups.sort((a,b)=>
            a.matchedWords.join(" ").localeCompare(b.matchedWords.join(" "))
        );
        
        return {searchResultGroups:resultsGroups};
    }
    combineWithLaterWordMatches(searchResults:SearchResult[],nextWordReferences:QuranWordReference[]):SearchResult[]{
        var newSearchResults = searchResults.map(searchResult=>{
            var matches=nextWordReferences.filter(x=>(
                x.surahNumber===searchResult.surahNumber
                &&
                x.ayahNumber===searchResult.ayahNumber
                &&
                x.wordNumber>searchResult.matchingWordNumbers[searchResult.matchingWordNumbers.length-1]));
            if(matches.length>0){
                searchResult.matchingWordNumbers.push(matches[0].wordNumber)
                return searchResult
            }
            return null;
       })
       newSearchResults=newSearchResults.filter(x=>x!=null);
       return newSearchResults.map(x=>x!);


       //var matchingNextReferences = nextWordReferences.filter(nextref=>{
    //     if(nextref.surahNumber!=latestWordReference.)
    //    }) 
    }
}
export interface SearchResultGroup{
    id: string;
    searchResults: SearchResult[];
    matchedWords:string[]
}
export const useQuran = create<QuranState>(
    (set,get) => 
    ({
        quranTools:undefined,
        load:async ()=>{
            const chaptersResponse = await fetch(quranDataUrlBase+"chapters/en.json");
            const chapters = await chaptersResponse.json() as ChapterDetails[];
         
            const arabicChaptersResponse = await fetch(quranDataUrlBase+"quran.json");
            const arabicChapters = await arabicChaptersResponse.json() as Surahs;

            const englishChaptersResponse = await fetch(quranDataUrlBase+"editions/en.json");
            const englishChapters = await englishChaptersResponse.json() as Surahs;
            const arabicConcordance= new QuranConcordance(arabicChapters,"Arabic");
            const englishConcordance= new QuranConcordance(englishChapters,"English");
            set({quranTools:{
                arabicQuran:arabicChapters,
                englishQuran:englishChapters,
                chapterDetails:chapters,
                arabicConcordance:arabicConcordance,
                englishConcordance:englishConcordance,
            }})
        }
    }
    )
)