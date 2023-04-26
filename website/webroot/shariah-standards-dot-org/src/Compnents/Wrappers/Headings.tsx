export const PageHeading=(props:{children:any})=>
{
    return (
        <div className="text-2xl font-bold">{props.children}</div>
    );
}

export const SectionHeading=(props:{children:any})=>
{
    return (
        <div className="text-xl ">{props.children}</div>
    );
}