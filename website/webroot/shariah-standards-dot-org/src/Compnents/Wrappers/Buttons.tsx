export const Button=(props:{children: any, onClick:()=>void})=>
{
    return (<button onClick={props.onClick} className="rounded-md bg-slate-200 p-2">{props.children}</button>)
}
export const ActionButton=(props:{children: any, onClick:()=>void})=>
{
    return (<button onClick={props.onClick} className="rounded-md bg-green-900 text-yellow-400 p-2">{props.children}</button>)    
}