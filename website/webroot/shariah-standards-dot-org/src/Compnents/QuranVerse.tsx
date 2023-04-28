import { PageContainer, PageHeading, SelectList, SelectListOption } from "./Wrappers"
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChapterDetails, useQuran } from "../Services/QuranService";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";
import {AiOutlineBorder, AiOutlineCheckSquare} from 'react-icons/ai' 


export const QuranVerse=()=>{
    const {chapter,verse}=useParams();
    const {quranTools,load}=useQuran();
    
    const currentChapterNumber=()=>{
        return chapter??"1";
    }
    const currentVerseNumber=()=>{
        return verse??"1";
    }
    const [linksOnArabicWords,setLinksOnArabicWords]=useLocalStorage("ShariahStandards-QuranVerse-linkedArablcWords",false)
    const navigate = useNavigate();
    const navigateToMatchingRoute=(surah:string,verse:string)=>{
        navigate("/QuranVerse/"+surah+"/"+verse)
    }
    let selectedChapterDetails:ChapterDetails|undefined=undefined;
    if(quranTools){
        var chapterIndex=Number(currentChapterNumber())-1;
        selectedChapterDetails=quranTools.chapterDetails[chapterIndex];
    }
    let verseOptions:SelectListOption[]=[]
    if(selectedChapterDetails){
        verseOptions = Array.from(Array(selectedChapterDetails.total_verses).keys())
        .map(index=>{return index+1;}).map(num=>{return {content:num.toString(),keyValue:num.toString()}})
    }
    useEffect(()=>{
        if(!quranTools){
            load()
        }
    },[load,quranTools]);
     
    return (
        <PageContainer>
            <PageHeading>Qur'an Verse Browser</PageHeading>

            {quranTools 
            &&
            <div>
                Chapter (Surah)
                <SelectList options={quranTools.chapterDetails.map(c=>{
                    return {
                    content : c.id+" "+c.translation+" ("+c.name+" "+c.transliteration+")",
                    keyValue :c.id.toString()
                    }})}
                    selectedOptionKeyValue={currentChapterNumber()}
                    onChange={val=>navigateToMatchingRoute(val,"1")}            
                />
                Verse (Ayah)
                <SelectList 
                    options={verseOptions} 
                    selectedOptionKeyValue={verse??"1"}
                    onChange={val=>navigateToMatchingRoute(chapter??"1",val)}
                    />
            </div>}
            <div className="flex flex-row items-center cursor-pointer" onClick={()=>setLinksOnArabicWords(!linksOnArabicWords)}>
                
                <div className="text-xl">{linksOnArabicWords && <AiOutlineCheckSquare/>}
                {!linksOnArabicWords && <AiOutlineBorder/>}</div>
                <div>Add search links for arabic words</div>
            </div>
            {quranTools===undefined &&<div>loading Qur'an...</div>}
            {quranTools && 
            <>
                <div className="m-2 text-xl w-1/2 p-2 border-2 shadow-md rounded-sm bg-green-50 border-slate-300">
                    {!linksOnArabicWords && quranTools.arabicQuran[currentChapterNumber()][Number(currentVerseNumber())-1].text}
                    {linksOnArabicWords && quranTools.arabicQuran[currentChapterNumber()][Number(currentVerseNumber())-1].text.split(' ').map(word=>
                        <Link to={"/QuranSearch/Arabic/"+encodeURI(word)}>{word} {" "}</Link>)}
                </div>
                <div className="m-2 text-xl w-1/2 p-2 border-2 shadow-md rounded-sm bg-yellow-50 border-slate-300">
                    {quranTools.englishQuran[currentChapterNumber()][Number(currentVerseNumber())-1].text}
                </div>
            </>
            }
        </PageContainer>
    )
}