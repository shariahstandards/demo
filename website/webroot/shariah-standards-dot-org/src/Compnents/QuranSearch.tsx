import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Input, PageContainer, SectionHeading } from "./Wrappers"
import { useEffect, useState } from "react";
import { SearchResultGroup, SearchResults, useQuran as useQuranTools } from "../Services/QuranService";
import { ArabicKeyboard } from "./ArabicKeyboard";
import useLocalStorage from "use-local-storage";

export const QuranSearch=()=>{
    const {searchText,searchLanguage}=useParams();
    const [nextSearchText,setNextSearchText]=useState(searchText??"");
    const {quranTools,load}=useQuranTools();
    const [searchResults,setSearchResults]=useState<SearchResults|undefined>();
    const [defaultLanguage,setDefaultLanguage]=useLocalStorage("ShariahStandards-QuranSearch-defaultLanguage","English");
    const arabicSearch=((searchLanguage && searchLanguage==="Arabic") || defaultLanguage==="Arabic");
    const navigate=useNavigate();
    const navigateToSearch=()=>{

        navigate("/QuranSearch/"+(arabicSearch?"Arabic":"English")+"/"+encodeURI(nextSearchText));
    };
    const changeSearchLanguage=(isArabic:boolean)=>{
        setDefaultLanguage(isArabic?"Arabic":"English");
        setNextSearchText("");
        navigate("/QuranSearch/"+(isArabic?"Arabic":"English")+"/");
    };
    useEffect(()=>{
        if(quranTools && searchText && searchText!==""){
            if(arabicSearch){
                var arabicSearchResults = quranTools.arabicConcordance.search(searchText);
                setSearchResults(arabicSearchResults);
            }else{
                var englishSearchResults = quranTools.englishConcordance.search(searchText);
                setSearchResults(englishSearchResults);
            }
        }
    },[quranTools,searchText,arabicSearch])
    useEffect(()=>{
        if(!quranTools){
            load()
        }
    },[load,quranTools]);
    if(quranTools===undefined){
        return (<div>loading Qur'an</div>)
    }
    let totalSearchResults=0;
    if(searchResults){
        searchResults.searchResultGroups.forEach(g=>totalSearchResults+=g.searchResults.length)
    }
    return (
        <PageContainer>
            <SectionHeading>Qur'an Search</SectionHeading>
            <div>
                <Input value={nextSearchText} 
                    placeholder="type search text" 
                    onChange={val=>setNextSearchText(val)}
                    onEnter={navigateToSearch}/>
                <Button onClick={navigateToSearch}>Search</Button>
{" "}in{" "}         
                {arabicSearch && <Button onClick={()=>changeSearchLanguage(false)}>Arabic</Button>}   
                {(!arabicSearch)&& <Button onClick={()=>changeSearchLanguage(true)}>English</Button>}
            </div>
            {arabicSearch && <ArabicKeyboard includedLetters={quranTools.arabicConcordance.allLetters()} value={nextSearchText} onChanged={(val)=>setNextSearchText(val)}/> }
            
            {searchResults && searchText && searchText!=="" &&  
            <div className="w-1/2">
                {searchResults.searchResultGroups.length===0 && <div className="text-center">No Results Found</div>}
                {searchResults.searchResultGroups.length>0 && <SectionHeading>{totalSearchResults} Search Results for &quot;{searchText}&quot; :</SectionHeading>}
                
                {searchResults.searchResultGroups.map(group=>
                    <SearchResultGroupListing key={group.id} group={group} isArabic={arabicSearch}/>)
                }

            </div>}
           

        </PageContainer>
    )
}
export const SearchResultGroupListing=(props:{group:SearchResultGroup,isArabic:boolean})=>{
    const [shown,setShown]=useState(props.group.searchResults.length<5)
    const group=props.group;
    return(
    <div>
<div className="bg-green-200 w-full p-2 mb-1 font-bold">
    {group.searchResults.length} Matches for {group.matchedWords.map(matchedWord=><span key={matchedWord}>&quot;{matchedWord}&quot;{" "}</span>)}
    {(!shown) && <Button onClick={()=>setShown(true)}>show</Button>}
    {(shown) && <Button onClick={()=>setShown(false)}>hide</Button>}
</div>
{shown && <div className="w-full">
    {group.searchResults.map(searchResult=>
        <div className="" key={searchResult.id}>
            <Link className="underline" to={"/QuranVerse/"+searchResult.surahNumber+"/"+searchResult.ayahNumber}>{searchResult.surahNumber+":"+searchResult.ayahNumber} 
            </Link>
            <div className={"p-2 mb-1 "+props.isArabic?"text-xl":""}>
            {searchResult.searchResultVerseWords.map((x)=>
            <span key={x.id} className={x.highlight?"text-red-600 font-bold":""}>
                {x.word}{" "}
            </span>
            )}
            </div>
        </div>)
    }
</div>}
</div>)
}