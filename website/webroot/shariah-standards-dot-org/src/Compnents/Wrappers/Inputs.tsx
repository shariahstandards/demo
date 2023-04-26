import {KeyboardEvent} from 'react'
export interface InputProps{
    value:string,
    onChange:(newValue:string)=>void,
    placeholder:string|undefined,
    onEnter:(()=>void) |(()=>Promise<void>) | undefined

}
export const Input = (props:InputProps)=>{
    const handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key==="Enter" && props.onEnter) {
          props.onEnter();
        }
      };
    return <input onKeyUp={handleKeypress} placeholder={props.placeholder} className="border-solid border-2 border-slate-500 p-1 m-1" value={props.value} onChange={(e)=>props.onChange(e.target.value)}/>
}
export interface NumberInputProps{
    value:string,
    onChange:(newValue?:number)=>void,
    placeholder?:string,
    min?:number,
    max?:number,
    step?:number,
    
}
export const NumberInput = (props:NumberInputProps)=>{
    // const [textValue,setTextValue]=useState<string>(props?.value?.toString()??"")
    const handleNewValue=(newTextValue:string)=>{
        if(isNaN(Number(newTextValue))){
            props.onChange();
        }else{
            props.onChange(Number(newTextValue));
        }
    }
    return (
        <input 
            type='number'
            placeholder={props.placeholder} 
            className="border-solid border-2 border-slate-500 p-1 m-1" 
            value={props.value} 
            onChange={(e)=>handleNewValue(e.target.value)}
            min={props.min}
            max={props.max}
            step={props.step}
            />
    )
}
export interface SelectListOption{
    content:any,
    keyValue:string
}
export interface SelectListProps{
    options:SelectListOption[],
    selectedOptionKeyValue:string,
    onChange:(newValue:string)=>void
}
export const SelectList = (props:SelectListProps)=>{
    return(
        <select 
            className="border-solid border-2 border-slate-500 p-1 m-1"             
            value={props.selectedOptionKeyValue} onChange={(e)=>props.onChange(e.target.value)}>
            {props.options.map(opt=><option key={opt.keyValue} value={opt.keyValue}>{opt.content}</option>)}
        </select>
    )
}

