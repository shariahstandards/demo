import { AiOutlineBorder, AiOutlineCheckSquare } from "react-icons/ai"

export const Checkbox=(props:{children:any,value:boolean,OnChecked:()=>void,OnUnchecked:()=>void})=>{

    const clicked=()=>{
        if(props.value){
            props.OnUnchecked();
        }else{
            props.OnChecked();
        }
    }
    return(
    <div className="flex flex-row items-center cursor-pointer" onClick={clicked}>
                
        <div className="text-xl">{props.value && <AiOutlineCheckSquare/>}
        {(!props.value) && <AiOutlineBorder/>}</div>
        <div>{props.children}</div>
    </div>
    )
}