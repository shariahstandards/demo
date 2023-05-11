export const PageContainer=(props:{children:any})=>{
    return (
        <div className="flex flex-col justify-center items-center md:m-5">
            {props.children}
        </div>
    )
}