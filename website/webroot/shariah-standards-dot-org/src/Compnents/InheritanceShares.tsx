import { useCallback, useEffect } from "react";
import { Button, NumberInput, PageContainer, PageHeading, SectionHeading } from "./Wrappers"
import useLocalStorage from "use-local-storage";
export class Fraction{
	constructor(public top:number,public bottom:number){

	}
	primes:number[]=[2,3,5,7,11,13,17,19]
	static add(a:Fraction,b:Fraction){
		var sum= new Fraction(a.top*b.bottom + b.top*a.bottom,a.bottom*b.bottom);
		sum.reduce();
		return sum;
	}
	static minus(a:Fraction,b:Fraction){
	var subtraction= new Fraction(a.top*b.bottom - b.top*a.bottom,a.bottom*b.bottom);
		subtraction.reduce();
		return subtraction;	
	}
	static minimum(a:Fraction,b:Fraction){
		var c=Fraction.minus(a,b);
		if(c.top>0){return b;}
		return a;
	}
	static divide(a:Fraction,b:Fraction){
		var f = new Fraction(a.top*b.bottom,a.bottom*b.top)
		f.reduce();
		return f;
	}
	static multiply(a:Fraction,b:Fraction){
		var f = new Fraction(a.top*b.top,a.bottom*b.bottom)
		f.reduce();
		return f;
	}
	static divideByInt(a:Fraction,n:number){
		var f = new Fraction(a.top,a.bottom*Math.round(n))
		f.reduce();
		return f;
	}
	static multiplyByInt(a:Fraction,n:number){
		var f = new Fraction(a.top*Math.round(n),a.bottom)
		f.reduce();
		return f;
	}
	reduce(){
		if(this.top===0){
			this.bottom=1;
			return;
		}
		var reduced=true;
		while(reduced){
			reduced=false;
			for(var p=0;p<this.primes.length;p++){
				var prime=this.primes[p];
				if((this.top%prime)===0 && (this.bottom%prime)===0){
					this.top = this.top/prime;
					this.bottom=this.bottom/prime;
					reduced=true;
					break;
				}
			}
		}

	}
}
export interface inheritanceShare{
	relationshipToDeceased:string,
	counter:number,
	share:number,
	fraction:Fraction
}
export interface inheritanceSituation{
	wives:number,
	husband:boolean,
	hasMother:boolean,
	hasFather:boolean,
	numberOfSons:number,
	numberOfDaughters:number,
	numberOfBrothers:number,
	numberOfSisters:number,
	isMale:boolean,
	shares:inheritanceShare[],
	allocatedShare:number,
	allocatedShareFraction:Fraction,
	unallocatedShare:number,
	unallocatedShareFraction:Fraction,
	hasDependentChildren:boolean
}

const Pronoun=(props:{isMale:boolean})=>{
    if(props.isMale){
        return <span>He&nbsp;</span>
    }
    return <span>She&nbsp;</span>

}
export const InheritanceShares=()=>{
    // const [situation,setSituation]=useState<inheritanceSituation|undefined>()
    const [isMale,setIsMale]=useLocalStorage<boolean>("ShariahStandards-IsMale",true);
    const [hasMother,setHasMother]=useLocalStorage<boolean>("ShariahStandards-HasMother",false);
    const [hasFather,setHasFather]=useLocalStorage<boolean>("ShariahStandards-HasFather",false);
    const [sons,setSons]=useLocalStorage<number>("ShariahStandards-Sons",0);
    const [daughters,setDaughters]=useLocalStorage<number>("ShariahStandards-Daughters",0);
    const [hasDependentChildren,setHasDependentChildren]=useLocalStorage<boolean>("ShariahStandards-HasDependentChildren",false);
    const [wives,setWives]=useLocalStorage<number>("ShariahStandards-Wives",0);
    const [hasHusband,setHasHusband]=useLocalStorage<boolean>("ShariahStandards-HasHusband",false);
    const [brothers,setBrothers]=useLocalStorage<number>("ShariahStandards-Brothers",0);
    const [sisters,setSisters]=useLocalStorage<number>("ShariahStandards-Sisters",0);
    const [inheritanceSituation,setInheritanceSituation]=useLocalStorage<inheritanceSituation|undefined>("ShariahStandards-InheritanceSituation",undefined);

    const sortDescending=(shares:inheritanceShare[])=>{
        return shares.sort((a,b)=>{
          if(Number(a.share)>Number(b.share)){return -1;}
          if(Number(a.share)<Number(b.share)){return 1;}
          if(a.relationshipToDeceased>b.relationshipToDeceased){return 1;}
          if(a.relationshipToDeceased<b.relationshipToDeceased){return -1;}
          if((a.counter??0)>(b.counter??0)){return 1;}
          if((a.counter??0)<(b.counter??0)){return -1;}
          return 0;
      });
    }
    const calculateAllocatedShareFraction=useCallback((situation:inheritanceSituation)=>{
		situation.shares=sortDescending(situation.shares);
    	var fractions = situation.shares.map(function(share){
			return share.fraction;
		});
		var sum = [new Fraction(0,1)].concat(fractions).reduce(function(a,b){
			return Fraction.add(a,b);
		});
		situation.allocatedShareFraction = sum;
		situation.unallocatedShareFraction = Fraction.minus(new Fraction(1,1),sum)
    },[])
    const calculateAllocatedShare=useCallback((situation:inheritanceSituation)=>{
		situation.shares = sortDescending(situation.shares);
    	var shares = situation.shares.map(function(share){
			return share.share;
		});
		var sum = [0].concat(shares).reduce(function(a,b){
			return a+b;
		});
		situation.allocatedShare = sum;
		situation.unallocatedShare = 1.0-sum;
		calculateAllocatedShareFraction(situation);
    },[calculateAllocatedShareFraction])
    const calculateShares= useCallback((situation:inheritanceSituation)=>{
    	situation.shares=[];
    	//fixed shares start
		if(situation.numberOfSons===0 && situation.numberOfDaughters===1){
			situation.shares.push({
				relationshipToDeceased:"daughter",
				share:0.5,
                counter:0,
				fraction:new Fraction(1,2)
			});
		}
		if(situation.numberOfSons===0 && situation.numberOfDaughters>=2){
			for(var d=0;d<situation.numberOfDaughters;d++)
			situation.shares.push({
				relationshipToDeceased:"daughter",
				counter:d+1,
				share:(2.0/3.0)/situation.numberOfDaughters,
				fraction:Fraction.divideByInt(new Fraction(2,3),situation.numberOfDaughters)
			});
		}
		if((situation.numberOfSons +situation.numberOfDaughters)>0){
			if(situation.hasFather){
				situation.shares.push(
				{
					relationshipToDeceased:"father",
					share:(1.0/6.0),
                    counter:0,
					fraction:new Fraction(1,6)
				});
			}
			if(situation.hasMother){
				situation.shares.push(
				{
					relationshipToDeceased:"mother",
					share:(1.0/6.0),
                    counter:0,
					fraction:new Fraction(1,6)
				});
			}
		}
		if(situation.numberOfSons +situation.numberOfDaughters===0){
			// if(situation.hasFather){
			// 	situation.shares.push(
			// 	{
			// 		relationshipToDeceased:"father",
			// 		counter:null,
			// 		share:(1.0/6.0),
			// 		fraction:new Fraction(1,6)
			// 	});
			// }
			if(situation.hasMother){
				if(situation.numberOfBrothers===0){
					situation.shares.push(
					{
						relationshipToDeceased:"mother",
						share:(1.0/3.0),
                        counter:0,
						fraction:new Fraction(1,3)
					});
				}else{
					situation.shares.push(
					{
						relationshipToDeceased:"mother",
						share:(1.0/6.0),
                        counter:0,
						fraction:new Fraction(1,6)
					});
				}
			}
		}
		//fard shares end
		calculateAllocatedShare(situation);
		if(situation.unallocatedShare<0.00001){
			return;
		}
		if(situation.unallocatedShareFraction.top===0){
			return;
		}
		
		if(situation.numberOfSons+situation.numberOfDaughters===0){
			if(!situation.isMale && situation.husband){
				situation.shares.push({
					relationshipToDeceased:"husband",
					share: Math.min(0.5,situation.unallocatedShare),
                    counter:0,
					fraction:Fraction.minimum(new Fraction(1,2),situation.unallocatedShareFraction)

				});
			}
			if(situation.isMale && situation.wives>0){
				var collectiveShareForWives=Math.min(0.25,situation.unallocatedShare);
				var shareForEachWife=collectiveShareForWives / situation.wives;
				var collectiveFractionForWives=Fraction.minimum(new Fraction(1,4),situation.unallocatedShareFraction);
				var fractionForEachWife = Fraction.divideByInt(collectiveFractionForWives,situation.wives);
				for(var w=1;w<=situation.wives;w++){
					situation.shares.push({
						relationshipToDeceased:"wife",
						counter:w,
						share:shareForEachWife,
						fraction:fractionForEachWife

					});
				}
			}
		}else{
			if(!situation.isMale && situation.husband){
				situation.shares.push({
					relationshipToDeceased:"husband",
					share:Math.min(0.25,situation.unallocatedShare),
                    counter:0,
					fraction:Fraction.minimum(new Fraction(1,4),situation.unallocatedShareFraction)
				});
			}
			if(situation.isMale && situation.wives>0){
				var collectiveShareForWivesCase2=Math.min(0.125,situation.unallocatedShare);
				var shareForEachWifeCase2=collectiveShareForWivesCase2 / situation.wives;
				var collectiveFractionForWivesCase2=Fraction.minimum(new Fraction(1,8),situation.unallocatedShareFraction);
				var fractionForEachWifeCase2 = Fraction.divideByInt(collectiveFractionForWivesCase2,situation.wives);
				for(var wifeNumber=1;wifeNumber<=situation.wives;wifeNumber++){
					situation.shares.push({
						relationshipToDeceased:"wife",
						counter:wifeNumber,
						share:shareForEachWifeCase2,
						fraction:fractionForEachWifeCase2

					});
				}
			}
		}
		
		calculateAllocatedShare(situation);
		
		if(situation.unallocatedShare<0.00001){
			return;
		}
		if(situation.unallocatedShareFraction.top===0){
			return;
		}
		//kalalah
		var hasDependentChildren=situation.hasDependentChildren&&(situation.numberOfDaughters>0 || situation.numberOfSons>0);

		if(
			(!situation.hasFather && !situation.hasMother)
			&& ((situation.numberOfSons===0 && situation.numberOfDaughters===0) 
				|| !hasDependentChildren)
			){
			var siblingCount=situation.numberOfSisters+situation.numberOfBrothers;
			if((situation.numberOfSons+situation.numberOfDaughters>0) && !hasDependentChildren){

				var adjustedShare=Math.min(1.0/3.0,situation.unallocatedShare);
				var adjustedShareFraction=Fraction.minimum(new Fraction(1,3),situation.unallocatedShareFraction);

				if(siblingCount===1){
					adjustedShare=Math.min(1.0/6.0,situation.unallocatedShare);
					adjustedShareFraction=Fraction.minimum(new Fraction(1,6),situation.unallocatedShareFraction);
				}
				
				for(var b=0;b<situation.numberOfBrothers;b++){
					situation.shares.push({
						relationshipToDeceased:"brother",
						counter:b+1,
						share:adjustedShare/siblingCount,
						fraction:Fraction.divideByInt(adjustedShareFraction,siblingCount)
					})
					//console.log("adding share b");

				}
				for(var s=0;s<situation.numberOfSisters;s++){
					situation.shares.push({
						relationshipToDeceased:"sister",
						counter:s+1,
						share:adjustedShare/siblingCount,
						fraction:Fraction.divideByInt(adjustedShareFraction,siblingCount)
		
					})
					//console.log("adding share s");

				}
			}else{
				if(situation.numberOfBrothers===0){
					if(situation.numberOfSisters===1){
			 			var adjustedShareSister=Math.min(0.5,situation.unallocatedShare);
			 			var adjustedShareFractionSister = Fraction.minimum(new Fraction(1,2),situation.unallocatedShareFraction)
						situation.shares.push({
							relationshipToDeceased:"sister",
							share:adjustedShareSister,
                            counter:0,
							fraction:adjustedShareFractionSister
						})
					}
					if(situation.numberOfSisters>1){
						var adjustedShareSisters=Math.min(2.0/3.0,situation.unallocatedShare);
						var adjustedShareFractionSisters = Fraction.minimum(new Fraction(2,3),situation.unallocatedShareFraction)
						for(var s2=0;s2<situation.numberOfSisters;s2++){
							situation.shares.push({
								relationshipToDeceased:"sister",
								counter:s2+1,
								share:adjustedShareSisters/situation.numberOfSisters,
								fraction:Fraction.divideByInt(adjustedShareFractionSisters,situation.numberOfSisters)
							});
							//console.log("adding share s2");
						}
					}
				}else{
					var numberOfSiblingsShares=(situation.numberOfBrothers*2)+situation.numberOfSisters;
					var sistersShare=situation.unallocatedShare/numberOfSiblingsShares;
					var sistersShareFraction =
						Fraction.divideByInt(situation.unallocatedShareFraction,numberOfSiblingsShares);

					for(var b3=0;b3<situation.numberOfBrothers;b3++){
						situation.shares.push({
							relationshipToDeceased:"brother",
							counter:b3+1,
							share:sistersShare*2,
							fraction:Fraction.multiplyByInt(sistersShareFraction,2)
						});
					}
					for(var s5=0;s5<situation.numberOfSisters;s5++){
						situation.shares.push({
							relationshipToDeceased:"sister",
							counter:s5+1,
							share:sistersShare,
							fraction:sistersShareFraction
						});
					}
				}
			}
		}
		//limited shares end
		calculateAllocatedShare(situation);
		if(situation.unallocatedShare<0.00001){
			return;
		}
		if(situation.unallocatedShareFraction.top===0){
			return
		}
		if(situation.numberOfSons>0){

			var numberOfChildrenShares=(situation.numberOfSons*2)+situation.numberOfDaughters;
			var daughterShare=situation.unallocatedShare/numberOfChildrenShares;
			var daughtersShareFraction = Fraction.divideByInt(situation.unallocatedShareFraction,numberOfChildrenShares)
			for(var s4=0;s4<situation.numberOfSons;s4++){
				situation.shares.push({
					relationshipToDeceased:"son",
					counter:s4+1,
					share:daughterShare*2,
					fraction:Fraction.multiplyByInt(daughtersShareFraction,2)
				});
			}
			for(var d2=0;d2<situation.numberOfDaughters;d2++){
				situation.shares.push({
					relationshipToDeceased:"daughter",
					counter:d2+1,
					share:daughterShare,
					fraction:daughtersShareFraction
				});
			}
		
		}
		if(situation.numberOfSons===0 && situation.numberOfDaughters===0 && situation.hasFather){
			situation.shares.push({
				relationshipToDeceased:"father",
				fraction:situation.unallocatedShareFraction,
				share:situation.unallocatedShare,
                counter:0
			})
		}
		calculateAllocatedShare(situation);
		if(situation.unallocatedShare<0.00001){
			return;
		}
		// if(situation.hasFather || situation.hasMother
		//  || situation.numberOfSons>0 || situation.numberOfDaughters>0){
			// var parentsAndChildrensTotalShareFraction=new Fraction(0,1);
			// situation.shares.forEach(share=>{
			// 	if(share.relationshipToDeceased=="father" 
			// 		|| share.relationshipToDeceased=="mother"
			// 		|| share.relationshipToDeceased=="daughter"
			// 		|| share.relationshipToDeceased=="son")
			// 	{
			// 		parentsAndChildrensTotalShareFraction=
			// 		Fraction.add(parentsAndChildrensTotalShareFraction,share.fraction);
			// 	}
			// })
			console.log("reallocating unused shares to minimum shares");
			// console.log("qualifying minimum shares"+parentsAndChildrensTotalShareFraction.top+" / "+parentsAndChildrensTotalShareFraction.bottom);
			situation.shares.forEach(share=>{
				// if(share.relationshipToDeceased=="father" 
				// 	|| share.relationshipToDeceased=="mother"
				// 	|| share.relationshipToDeceased=="daughter"
				// 	|| share.relationshipToDeceased=="son")
				// {
					var additionalShareOfRemainder=Fraction
						.divide(share.fraction,situation.allocatedShareFraction);
					console.log(share.relationshipToDeceased+ " has share of remainder = "
						+additionalShareOfRemainder.top+" / "+additionalShareOfRemainder.bottom);
					
					var additionalShareOfEstate=
						Fraction.multiply(situation.unallocatedShareFraction,additionalShareOfRemainder);
					console.log(share.relationshipToDeceased+ " has additional share of estate = "
						+additionalShareOfEstate.top+" / "+additionalShareOfEstate.bottom);
				
					share.fraction = Fraction.add(share.fraction,additionalShareOfEstate);
					share.share=share.share+(additionalShareOfEstate.top/additionalShareOfEstate.bottom)
				// }
			});
		// }
		calculateAllocatedShare(situation);
		if(situation.unallocatedShare<0.00001){
			return;
		}
		situation.shares.push({
			relationshipToDeceased:"zakat",
			share:situation.unallocatedShare,
			fraction:situation.unallocatedShareFraction,
            counter:0
		});
		calculateAllocatedShare(situation);
    },[calculateAllocatedShare])
    useEffect(()=>{
        var situation:inheritanceSituation={
            hasFather:hasFather,
            hasMother:hasMother,
            husband:hasHusband,
            isMale:isMale,
            numberOfBrothers:brothers,
            numberOfDaughters:daughters,
            numberOfSisters:sisters,
            numberOfSons:sons,
            hasDependentChildren:hasDependentChildren,
            wives:wives,
            allocatedShare:0,
            allocatedShareFraction:new Fraction(0,1),
            shares:[],
            unallocatedShare:0,
            unallocatedShareFraction:new Fraction(0,1)
           }
        calculateShares(situation);
        setInheritanceSituation(situation);
    },[brothers,sisters,hasDependentChildren,hasFather,hasHusband,hasMother,sons,daughters,calculateShares,isMale,setInheritanceSituation,wives]);
    const toHexPair=(num:number)=>{
		var val=128;
	//	console.log("num="+num);
		if(num!=null){
			val= 128+((num*32)%127)
		}
	//	console.log("value="+val);
		var hex=val.toString(16)
	//	console.log("hex="+hex);
		return hex;
	}
    const getColour=(share:inheritanceShare)=>{

        var hex="00";
		if(share.relationshipToDeceased=== "zakat"){
			return "#DDFFDD";
		}
		if(share.relationshipToDeceased=== "mother"){
			return "#FF9A56";
		}
		if(share.relationshipToDeceased==="father"){
			return "#824E2C"
		}
		if(share.relationshipToDeceased==="wife"){
			hex=toHexPair(share.counter);
			return "#"+hex+hex+"00";
		}
		if(share.relationshipToDeceased==="husband"){
			return "#35E0DA"
		}
		if(share.relationshipToDeceased==="son"){
			hex=toHexPair(share.counter);
			return "#0000"+hex;
		}
		if(share.relationshipToDeceased==="daughter"){
			hex=toHexPair(share.counter);
			return "#"+hex+"00"+hex;
		}
		if(share.relationshipToDeceased==="brother"){
			hex=toHexPair(share.counter);
			return "#00"+hex+"00";
		}
		if(share.relationshipToDeceased==="sister"){
			hex=toHexPair(share.counter)
			return "#"+hex+"0000";
		}
        return "#"+hex+"0000";
	}
    const getPieChartData=(newInheritanceSituation:inheritanceSituation):PieChartSlice[]=>{
        
		return newInheritanceSituation!.shares.map(s=>{
			return {
				percentage:s.share*100.0,
				label:s.relationshipToDeceased+" "+s.counter,
				colour:getColour(s)
			}
		});
	}
    return (
        <PageContainer>
            <PageHeading>Inheritance Shares Calculator</PageHeading>
            <SectionHeading>Description of the deceased person:</SectionHeading> 
            <div className="flex flex-col text-left">
                <div className="p-1">
                    The deceased was &nbsp;
                    {isMale && <Button onClick={()=>setIsMale(false)}>male</Button>}
                    {(!isMale) && <Button onClick={()=>setIsMale(true)}>female</Button>}                
                </div>
                <div className="p-1">
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    {hasMother && <Button onClick={()=>setHasMother(false)}> a mother</Button>}
                    {(!hasMother) && <Button onClick={()=>setHasMother(true)}> no mother</Button>}
                </div>
                <div className="p-1">
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    {hasFather && <Button onClick={()=>setHasFather(false)}> a father</Button>}
                    {(!hasFather) && <Button onClick={()=>setHasFather(true)}> no father</Button>}
                </div>
                <div className="p-1">
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    <NumberInput min={0} max={99} value={sons.toString()} onChange={(val)=>setSons(val)}/> son{sons>1 && <>s</>}
                </div>
                <div className="p-1">
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    <NumberInput min={0} max={99} value={daughters.toString()} onChange={(val)=>setDaughters(val)}/> daughter{daughters>1 && <>s</>}
                </div>
                {((sons+daughters)>0) &&
                <div className="p-1">
                    <Pronoun isMale={isMale}/> leaves behind &nbsp;
                    {hasDependentChildren && <Button onClick={()=>setHasDependentChildren(false)}> children under 16 years old</Button>}
                    {(!hasDependentChildren) && <Button onClick={()=>setHasDependentChildren(true)}> no children under 16 years old</Button>}
                </div>
                }
                {isMale &&
                    <div>
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    <NumberInput min={0} max={4} value={wives.toString()} onChange={(val)=>setWives(val)}/> {wives===0 && <>wives</>}{wives===1 && <>wife</>}{wives>1 && <>wives</>}
                    </div>
                }
                {(!isMale) &&
                    <div>
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    {hasHusband && <Button onClick={()=>setHasHusband(false)}> a husband</Button>}
                    {(!hasHusband) && <Button onClick={()=>setHasHusband(true)}> no husband</Button>}
                    </div>
                }
                <div className="p-1">
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    <NumberInput min={0} max={99} value={brothers.toString()} onChange={(val)=>setBrothers(val)}/> brother{brothers>1 && <>s</>}
                </div>
                <div className="p-1">
                    <Pronoun isMale={isMale}/>leaves behind &nbsp;
                    <NumberInput min={0} max={99} value={sisters.toString()} onChange={(val)=>setSisters(val)}/> sister{sisters>1 && <>s</>}
                </div>
            </div>    
            {inheritanceSituation &&
                <>
                <PieChart data={getPieChartData(inheritanceSituation)} size={300}/>
                <div>
                    <SectionHeading>Shares</SectionHeading>
                    <table className="w-full table-auto text-left p-2 min-w-full">
                        <thead>
                            <tr >
                                <th className="p-1">Colour</th>
                                <th className="p-1">Relationship</th>
                                <th className="p-1">Share as percent</th>
                                <th className="p-1">Share as a fraction</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {inheritanceSituation.shares.map((share,index)=>
                            <tr key={index+"-"+share.counter}>
                                <td style={{backgroundColor:getColour(share)}}>
                                    &nbsp;
                                </td>
                                <td>
                                    {share.relationshipToDeceased}
                                </td>
                                <td>
                                    {(share.share*100).toFixed(6)} %
                                </td>
                                <td>
                                {share.fraction.top} / {share.fraction.bottom}
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table> 
                </div>
                </>
                
            }
           
            {/* <div className="row">
                
            </div>
            <div *ngIf="overAllocationSituations.length>0">
            <h3>All situation permutations</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th> Mother </th>
                        <th> Father </th>
                        <th> Sons</th>
                        <th> Daughters</th>
                        <th> Dependent Children</th>
                        <th> Married </th>
                        <th> Male </th>
                        <th> Brothers </th>
                        <th> Sisters</th>
                        <th> % Allocated </th>
                    </tr>
                </thead>
                <tbody>
                    <ng-template ngFor [ngForOf]="exampleSituations" let-situation>
                        <tr>
                            <td>
                                <span *ngIf="situation.hasMother">Y</span>
                                <span *ngIf="!situation.hasMother">N</span>
                            </td>
                            <td>
                                <span *ngIf="situation.hasFather">Y</span>
                                <span *ngIf="!situation.hasFather">N</span>
                            </td>
                            <td>
                                {{situation.numberOfSons}}
                            </td>
                            <td>
                                {{situation.numberOfDaughters}}
                            </td>
                            <td>
                                <span *ngIf="situation.hasDependentChildren">Y</span>
                                <span *ngIf="!situation.hasDependentChildren">N</span>
                            </td>
                            <td>
                                <span *ngIf="situation.isMarried">Y</span>
                                <span *ngIf="!situation.isMarried">N</span>
                            </td>
                            <td>
                                <span *ngIf="situation.isMale">Y</span>
                                <span *ngIf="!situation.isMale">N</span>
                            </td>
                            <td>
                                {{situation.numberOfBrothers}}
                            </td>
                            <td>
                                {{situation.numberOfSisters}}
                            </td>
                            <td>
                                {{situation.allocatedShare.toPrecision(5)*100}} %
                            </td>
                        </tr>			
                    </ng-template>
                </tbody>
            </table>	
            </div> */}
        </PageContainer>
    )
}
export interface PieChartSlice
{
    percentage:number,
    label:string,
    colour:string
}
export interface PieChartSector{
	percentage: number,
	label: string,
	color: string,
	arcSweep: number,
	largeArc:number,
	L: number,
	X: number,
	Y: number,
	R: number
}
export const PieChart=(props:{data:PieChartSlice[],size:number})=>{
    const calculateSectors=():PieChartSector[]=>{
		var data = {
			size:props.size,
			sectors:props.data
		};
	    if(props.data.some(x=>isNaN(x.percentage)))
  		{
  			data.sectors=[{
  				colour:'#AAA',
  				label:'no data',
  				percentage:100
  			}]
  		}

  		let sectors:PieChartSector[] = [];
	    var l = data.size / 2
	    var aRad = 0 // Angle in Rad
	    var x = 0 // Side x
	    var y = 0 // Side y
	    var X = 0 // SVG X coordinate
	    var Y = 0 // SVG Y coordinate
	    var R = 0 // Rotation

	    data.sectors.forEach(item => {
	        aRad = (item.percentage/100.0) * 2 * Math.PI;
	        y=l*Math.sin(aRad);
	        x=l*Math.cos(aRad);
            X = l + x;
            var largeArc=0;
            var arcSweep=1;
	        if( aRad > Math.PI ) {
	         	largeArc=1
	        }
	        Y = l + y;
	        sectors.push({
	            percentage: (item.percentage/100),
	            label: item.label,
	            color: item.colour,
	            arcSweep: arcSweep,
	            largeArc:largeArc,
	            L: l,
	            X: X,
	            Y: Y,
	            R: R
	        });

	        R = R + aRad*180/Math.PI;
	    })

    	return sectors
	}

    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" width={props.size+"px"} height={props.size+"px"} viewBox={"0 0 "+props.size+" "+props.size}>
                {
                    calculateSectors().map((sector,index)=>
                        <g 
                            key={index+"-"+sector.percentage}
                        >{sector.percentage===1 &&
                            <circle 
                                cx={sector.L}
                                cy={sector.L}
                                r={sector.L}
                                fill={sector.color}
                                ></circle>}
                        {sector.percentage!==1 &&
                            <path 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill={sector.color}
                                d={'M' + sector.L + ',' + sector.L + ' L' + sector.L*2 +',' + sector.L + ' A' + sector.L + ',' + sector.L + ' 0 '+sector.largeArc+','+sector.arcSweep+' ' + sector.X + ', ' + sector.Y }
                                transform={'rotate(' + sector.R + ', '+ sector.L+', '+ sector.L+')'}
                            />}
                        </g>
                    )
                }
            </svg>
        </div>
    )
}