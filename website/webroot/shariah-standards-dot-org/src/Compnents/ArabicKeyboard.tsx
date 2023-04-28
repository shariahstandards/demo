
export const KeyboardKey=(props:{onClick:()=>void, contents:string})=>{
    return(
        <div className="w-min-30 text-lg border-2 rounded-md m-1 shadow-md p-4 cursor-pointer" onClick={()=>props.onClick()}>
            {props.contents}
        </div>
    )
}



export const BuildKeyboardRows=(includedLetters:string[])=>{
    var keys = {
		rows:[
            "ذ1234567890-=A".split(''),
            "ضصثقفغعهخحجدAA".split(''),
            "شسيبلاتنمكط\\AA".split(''),
            "\\ئءؤرىةوزظAAAA".split(''),
		    "ّ!@#$%^&*)(_+AA".split(''),
        ]
	};
    var lettersMissingFromDefaultKeyboard = includedLetters.filter(letter=>{
        var letterFound=false;
        keys.rows.forEach(row=>{
            if(row.indexOf(letter)>=0){
                letterFound=true;
            }});
        
        return !letterFound;
    });
    lettersMissingFromDefaultKeyboard=lettersMissingFromDefaultKeyboard.sort((a,b)=>a.charCodeAt(0)- b.charCodeAt(0));
    var allLettersOnDefaultKeyboard=keys.rows[0]
        .concat(keys.rows[1])
        .concat(keys.rows[2])
        .concat(keys.rows[3])
        .concat(keys.rows[4])
       
    var unusedLettersOnKeyboard = allLettersOnDefaultKeyboard.filter(kbLetter=>
        {
            return includedLetters.indexOf(kbLetter)<0
        });
    var fixRow=(currentKeys:string[])=>{
        var newKeys:string[]=[];
        currentKeys.forEach(key=>{
            if(unusedLettersOnKeyboard.indexOf(key)<0){
                newKeys.push(key);
            }else{
                if(lettersMissingFromDefaultKeyboard.length>0){
                    newKeys.push(lettersMissingFromDefaultKeyboard.splice(0,1)[0])
                }
            }
        })
        return newKeys;
    }
    var undatedKeys = {
        rows:[
            fixRow(keys.rows[0]),
            fixRow(keys.rows[1]),
            fixRow(keys.rows[2]),
            fixRow(keys.rows[3]),
            fixRow(keys.rows[4])
        ]
    } 
    //console.log(lettersMissingFromDefaultKeyboard.length +" missing letters")
    return undatedKeys;
}


export const ArabicKeyboard=(props:{
    includedLetters:string[]
    value:string,
    onChanged:(newValue:string)=>void
})=>{
   
    const keys=BuildKeyboardRows(props.includedLetters);
    const add=(letter:string)=>{
        props.onChanged(props.value+letter)
    }
    
    return (
        <div>
            
            <div className="flex flex-col">
		        <div className="flex flex-row items-center justify-stretch"> 
                    {keys.rows[0].map(letter=><KeyboardKey key={letter} contents={letter} onClick={()=>add(letter)}/>)}
                </div>
                <div className="flex flex-row justify-stretch"> 
                    {keys.rows[1].map(letter=><KeyboardKey key={letter} contents={letter} onClick={()=>add(letter)}/>)}
                </div>
                <div className="flex flex-row justify-stretch"> 
                    {keys.rows[2].map(letter=><KeyboardKey key={letter} contents={letter} onClick={()=>add(letter)}/>)}
                </div>
                <div className="flex flex-row justify-stretch"> 
                    {keys.rows[3].map(letter=><KeyboardKey key={letter} contents={letter} onClick={()=>add(letter)}/>)}
                </div>
                <div className="flex flex-row justify-stretch"> 
                    {keys.rows[4].map(letter=><KeyboardKey key={letter} contents={letter} onClick={()=>add(letter)}/>)}
                </div>
            </div>
        
        </div>
    )
}
//       {     
// 		<div className="backspaceKey" (click)="backspace()">
// 			<i className="fa fa-arrow-left" aria-hidden="true"></i>
// 		</div>
// 		<div className="clear"></div>
// 		<div className="spacer2">&nbsp;</div>
// 		<div className="key" *ngFor="let key of keys.rows[1]" (click)="add(key)">{{key}}</div>
// 		<div className="clear"></div>
// 		<div className="spacer3">&nbsp;</div>
// 		<div className="key" *ngFor="let key of keys.rows[2]" (click)="add(key)">{{key}}</div>
// 		<div className="clear"></div>
// 		<div className="shiftKey" (click)="shift()"><i className="fa fa-arrow-up" aria-hidden="true"></i></div>
// 		<div className="spacer4">&nbsp;</div>
// 		<div className="key" *ngFor="let key of keys.rows[3]" (click)="add(key)">{{key}}</div>
// 	</div>
// 	<div *ngIf="shifted" className="keyboard">
// 		<div className="spacer1">&nbsp;</div>
// 		<div className="key" *ngFor="let key of keys.shiftedRows[0]" (click)="add(key)">{{key}}</div>
// 		<div className="backspaceKey" (click)="backspace()">
// 			<i className="fa fa-arrow-left" aria-hidden="true"></i>
// 		</div>
// 		<div className="clear"></div>
// 		<div className="spacer2">&nbsp;</div>
// 		<div className="key" *ngFor="let key of keys.shiftedRows[1]" (click)="add(key)">{{key}}</div>
// 		<div className="clear"></div>
// 		<div className="spacer3">&nbsp;</div>
// 		<div className="key" *ngFor="let key of keys.shiftedRows[2]" (click)="add(key)">{{key}}</div>
// 		<div className="clear"></div>
// 		<div className="shiftKey" (click)="shift()">
// 			<i className="fa fa-arrow-down" aria-hidden="true"></i>
// 		</div>
// 		<div className="spacer4">&nbsp;</div>
// 		<div className="key" *ngFor="let key of keys.shiftedRows[3]" (click)="add(key)">{{key}}</div>
// 	</div>
// </div>
