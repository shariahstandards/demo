import { Link } from "react-router-dom";

export const Menu=()=>{
    return (
        <div className="flex flex-row">
            <div className="w-1/4"></div>
        <div className="w-1/2 flex-col">
            
            <Link to={"/"}><MenuItem>Prayer Times and Direction</MenuItem></Link>
            <Link to="/Zakat"><MenuItem>Zakat Calculator</MenuItem></Link>
            <Link to="/Inheritance"><MenuItem>Inheritance Shares Calculator</MenuItem></Link>
            <Link to="/QuranSearch"><MenuItem>Qur'an Search</MenuItem></Link>
            <Link to="/QuranVerse"><MenuItem>Qur'an Browse</MenuItem></Link>
        </div>
        <div className="w-1/4"></div>
        </div>
    )
}
const MenuItem = (props:{children:any})=>{
    return(
    <div className="rounded-md bg-slate-300 m-2 p-2 w-full text-center">
        {props.children}
    </div>);
}