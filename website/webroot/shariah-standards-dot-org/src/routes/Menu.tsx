import { ReactElement } from "react"
import { Link } from "react-router-dom";

export const Menu=()=>{
    return (
        <div className="flex flex-row">
            <div className="w-1/4"></div>
        <div className="w-1/2 flex-col">
            <MenuItem>
                <Link to={"/"}>Prayer Times and Direction</Link>
            </MenuItem>
            {/* <MenuItem>
                <Link to="/SignIn">Sign in</Link>
            </MenuItem> */}
            <MenuItem>
                <Link to="/Zakat">Zakat Calculator</Link>
            </MenuItem>
        </div>
        <div className="w-1/4"></div>
        </div>
    )
}
const MenuItem = (props:{children:ReactElement})=>{
    return(
    <div className="rounded-md bg-slate-300 m-2 p-2 w-full text-center">
        {props.children}
    </div>);
}