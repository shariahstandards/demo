import { Button, PageContainer, PageHeading, SelectList, SelectListOption, TextArea } from "./Wrappers"
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChapterDetails, useQuran } from "../Services/QuranService";
import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import { Checkbox } from "./Wrappers/Checkbox";
import ReactMarkdown from 'react-markdown'
import { MdModeEdit } from "react-icons/md";
import { useEjaazaPermissions } from "../Services/ejaazaService";

export interface Comment{
    chapterNumber:string,
    verseNumber:string,
    markdownComment:string,
    state:string
}
export const QuranVerse = () => {
    const { chapter, verse } = useParams();
    const { quranTools, load } = useQuran();
    const { getPermission, permissions}=useEjaazaPermissions();

    const currentChapterNumber = () => {
        return chapter ?? "1";
    }
    const currentVerseNumber = () => {
        return verse ?? "1";
    }
    const [linksOnArabicWords, setLinksOnArabicWords] = useLocalStorage("ShariahStandards-QuranVerse-linkedArablcWords", false);
    const [showMoreThanOneVerse, setShowMoreThanOneVerse] = useLocalStorage("ShariahStandards-QuranVerse-showMoreThanOneVerse", false);
    const [comments,setComments]= useLocalStorage<Comment[]>("ShariahStandards-QuranVerse-comments", []);
    const [newComment,setNewComment]=useState("");
    const [editedComment,setEditedComment]=useState("");
    const [showEditComment,setShowEditComment]=useState(false);
    const navigate = useNavigate();
    const navigateToMatchingRoute = (surah: string, verse: string) => {
        navigate("/QuranVerse/" + surah + "/" + verse)
    }
    const showNextVerses=()=>{
        if(quranTools&& selectedChapterDetails){
            var nextVerse=Number(currentVerseNumber())+7;
            if(showMoreThanOneVerse){
                nextVerse=Math.min(nextVerse,selectedChapterDetails.total_verses);
             
                navigateToMatchingRoute(currentChapterNumber(),nextVerse.toString());
            }else{
                nextVerse=Number(currentVerseNumber())+1;
                nextVerse=Math.min(nextVerse,selectedChapterDetails.total_verses);
             
                navigateToMatchingRoute(currentChapterNumber(),nextVerse.toString());
            }
        }
    }
    const showNextSurah=()=>{
        if(quranTools&& selectedChapterDetails){
            var nextSurah=Number(currentChapterNumber())+1;
            nextSurah=Math.min(nextSurah,114);
            navigateToMatchingRoute(nextSurah.toString(),"1");

        }
    }
    const editComment=(comment:Comment)=>{
        setEditedComment(comment.markdownComment);
        setShowEditComment(true);
    }
    const addComment=()=>{
        var comment:Comment={
            chapterNumber:currentChapterNumber(),
            verseNumber:currentVerseNumber(),
            markdownComment:newComment,
            state:"private"
        };
        comments.push(comment);
        setNewComment("");
    }
    const updateComment=(newMarkdownText:string)=>{
        var chapter=currentChapterNumber();
        var verse=currentVerseNumber();
        var updatedComments=comments.filter(x=>x.chapterNumber!==chapter || x.verseNumber!==verse);
        if(newMarkdownText!==""){
            updatedComments.push(
                {
                    chapterNumber:chapter,
                    verseNumber:verse,
                    markdownComment:newMarkdownText,
                    state:"private"
                }
            )
        }
        setComments(updatedComments);
        setShowEditComment(false);
        setEditedComment("");
    }
    const publishCommentPermission="shariah-standards-dot-org.publish-quran-comment";
    const publishComment=async (comment:Comment)=>{
        if(permissions[publishCommentPermission]){
            var chapter=currentChapterNumber();
            var verse=currentVerseNumber();
            var updatedComments=comments.filter(x=>x.chapterNumber!==chapter || x.verseNumber!==verse);
                updatedComments.push(
                    {
                        chapterNumber:chapter,
                        verseNumber:verse,
                        markdownComment:comment.markdownComment,
                        state:"pending publication"
                    }
                )
                setComments(updatedComments);
                setShowEditComment(false);
                setEditedComment("");
        }
        console.log("todo save to shariah standards db here");
        
    }
    const cancelEditComment=()=>{
        setShowEditComment(false);
        setEditedComment("");
    }
    let selectedChapterDetails: ChapterDetails | undefined = undefined;
    if (quranTools) {
        var chapterIndex = Number(currentChapterNumber()) - 1;
        selectedChapterDetails = quranTools.chapterDetails[chapterIndex];
    }
    let verseOptions: SelectListOption[] = []
    if (selectedChapterDetails) {
        verseOptions = Array.from(Array(selectedChapterDetails.total_verses).keys())
            .map(index => { return index + 1; }).map(num => { return { content: num.toString(), keyValue: num.toString() } })
    }
    useEffect(() => {
        if (!quranTools) {
            load();
        }
       
    }, [load, quranTools]);
    let verseNumbersToShow = ()=>{
        if(quranTools===undefined || (!showMoreThanOneVerse) || selectedChapterDetails===undefined){
            return [currentVerseNumber()];
        }
        var minVerseNumber=Math.max(1,Number(currentVerseNumber())-3);
        var maxVerseNumber=Math.min(minVerseNumber+6,selectedChapterDetails.total_verses);
        let verseNumbers:string[]=[];
        for(var v=minVerseNumber;v<=maxVerseNumber;v++){
            verseNumbers.push(v.toString())
        }
        return verseNumbers;
    };

    const shownVerses=verseNumbersToShow();
    return (
        <PageContainer>
            <PageHeading>Qur'an Verse Browser</PageHeading>

            {quranTools
                &&
                <div>
                    Chapter (Surah)
                    <SelectList options={quranTools.chapterDetails.map(c => {
                        return {
                            content: c.id + " " + c.translation + " (" + c.name + " " + c.transliteration + ")",
                            keyValue: c.id.toString()
                        }
                    })}
                        selectedOptionKeyValue={currentChapterNumber()}
                        onChange={val => navigateToMatchingRoute(val, "1")}
                    />
                    Verse (Ayah)
                    <SelectList
                        options={verseOptions}
                        selectedOptionKeyValue={verse ?? "1"}
                        onChange={val => navigateToMatchingRoute(chapter ?? "1", val)}
                    />
                </div>}

            <Checkbox OnChecked={() => setLinksOnArabicWords(true)} OnUnchecked={() => setLinksOnArabicWords(false)} value={linksOnArabicWords}>Add search links for arabic words</Checkbox>
            <Checkbox OnChecked={() => setShowMoreThanOneVerse(true)} OnUnchecked={() => setShowMoreThanOneVerse(false)} value={showMoreThanOneVerse}>Show more than one verse</Checkbox>
            {quranTools === undefined && <div>loading Qur'an...</div>}
            {quranTools && 
            
            <div className="flex flex-col">
            {shownVerses.map(verseNumber=>
                <QuranVerseView
                linksOnArabicWords={linksOnArabicWords} 
                key={currentChapterNumber() + ":" + verseNumber}
                arabicVerse={quranTools.arabicQuran[currentChapterNumber()][Number(verseNumber) - 1].text}
                englishVerse={quranTools.englishQuran[currentChapterNumber()][Number(verseNumber) - 1].text}
                verseNumber={verseNumber}
                highlight={currentVerseNumber()===verseNumber && showMoreThanOneVerse} />)}
            
            </div>
            

            }
            <div className="flex flex-row items-center w-1/2">
                {selectedChapterDetails && quranTools && (shownVerses[shownVerses.length-1]!==selectedChapterDetails.total_verses.toString()) 
                && <div className="w-1/2 text-center"><Button onClick={showNextVerses}>Next Verse{showMoreThanOneVerse&&"s"}</Button></div>}
                {" "} {selectedChapterDetails && quranTools && (Number(currentChapterNumber())<114) 
                && <div className="w-1/2 text-center"><Button onClick={showNextSurah}>Next Surah</Button></div>}
            </div>
            {shownVerses.length===1 && comments.filter(x=>x.chapterNumber===currentChapterNumber() && x.verseNumber===shownVerses[0]).map(comment=>
                <div className="flex flex-col shadow-md bg-white border-2 m-2 rounded-md p-2" key={comment.chapterNumber+":"+comment.verseNumber}>
                    <div>Your comment on this verse:</div>
                    <div className="flex flex-row items-center ">

                    {!showEditComment && <div className={"shadow-md border-2 p-3"}><ReactMarkdown>{comment.markdownComment}</ReactMarkdown></div>}
                    {showEditComment && <div className={"shadow-md border-2 p-3"}><ReactMarkdown>{editedComment}</ReactMarkdown></div>}
                    {(!showEditComment && <div className="p-2"><Button onClick={()=>{editComment(comment)}}><MdModeEdit/></Button></div>)}
                    <div className="p-2">{!showEditComment && comment.state}</div>
                    {!showEditComment && permissions[publishCommentPermission] 
                        &&  comment.state!=="public" 
                        &&  comment.state!=="pending publication" 
                        &&                          
                                <div className="flex-shrink p-1">
                                    <Button onClick={()=>publishComment(comment)}>Make Public</Button>
                                </div>
                    }
                    {!showEditComment && permissions[publishCommentPermission]===undefined &&                            
                        <Button onClick={()=>getPermission(publishCommentPermission)}>Get Publish Permission</Button>
                    }
                        
                    </div>
                    {showEditComment &&
                        <div className="flex flex-row w-full">
                            <div className="flex-grow p-1"><TextArea markdownSupported={true} value={editedComment} onChange={(val)=>setEditedComment(val)} placeHolder=""/></div> 
                            <div className="flex-shrink p-1"><Button onClick={()=>updateComment(editedComment)}>Save</Button></div>
                            
                            <div className="flex-shrink p-1"><Button onClick={()=>cancelEditComment()}>Cancel</Button></div>

                        </div>
                    }
                </div>)
            }
            {shownVerses.length===1 && comments.filter(x=>x.chapterNumber===currentChapterNumber() && x.verseNumber===shownVerses[0]).length===0 
                &&
                <div>
                    <ReactMarkdown>{newComment}</ReactMarkdown>
                    <TextArea  markdownSupported={true} value={newComment} onChange={setNewComment} placeHolder="add personal verse comment here"/> 
                    {newComment.length>0 && <Button onClick={addComment}>Add Comment</Button>}
                </div>
                }
        </PageContainer>
    )
}

export const QuranVerseView = (props: { linksOnArabicWords: boolean, arabicVerse: string, englishVerse: string, verseNumber: string, highlight:boolean}) => {
    return (<div className={"flex md-flex-col lg:flex-row "+(props.highlight?"bg-red-200 shadow-md":"")}>

        <div className="arabic m-2 text-2xl w-1/2 p-2 border-2 shadow-md rounded-sm bg-green-50 border-slate-300">
            <span>({props.verseNumber}){" "}</span>
            {!props.linksOnArabicWords && props.arabicVerse}
            {props.linksOnArabicWords && props.arabicVerse.split(' ').map((word,wordIndex) =>
                <Link key={props.verseNumber+wordIndex} to={"/QuranSearch/Arabic/" + encodeURI(word)}>{word} {" "}</Link>)}
        </div>
        <div className="m-2 text-xl w-1/2 p-2 border-2 shadow-md rounded-sm bg-yellow-50 border-slate-300">
            <span>({props.verseNumber}){" "}</span>
            {props.englishVerse}
        </div>
    </div>)
}