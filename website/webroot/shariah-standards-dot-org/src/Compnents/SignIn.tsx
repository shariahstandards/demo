import { useState } from "react";

export const SignIn = ()=>{
    const [emailAddress,setEmailAddress] = useState("");

    const addEmailAddress=()=>{
        
    }
    return(
        <>
        <div style={{display: "flex", alignItems: "center",justifyContent:"center"}}>
            <h2>Sign in</h2>
        </div>
        <div style={{display: "flex", alignItems: "center",justifyContent:"center"}}>
            <input type={"email"} placeholder="type your email address" value={emailAddress} onChange={(e)=>setEmailAddress(e.target.value)} 
            style={{width:"300px", padding:10}}/>
            <button style={{padding:10, marginLeft:10}} onClick={()=>addEmailAddress()}>Send one time pass code</button>

        </div>
        </>
    )
}