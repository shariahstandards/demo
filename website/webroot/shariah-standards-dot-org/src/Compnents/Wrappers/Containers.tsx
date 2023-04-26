export const PageContainer=(props:{children:any})=>{
    return (
        <div className="flex flex-col justify-center items-center">
            {props.children}
        </div>
    )
}