import { useState } from "react";
import { CurrencyService } from "../Services/currencyService";
import { Button, NumberInput, PageContainer, PageHeading, SectionHeading, SelectList } from "../Compnents/Wrappers";
import useLocalStorage from "use-local-storage";

export interface asset{
	description:string,
	amount:number,
    id:string
} 
export interface debt{
	description:string,
	amount:number,
    id:string
} 
export interface currency{
	name:string,
	personalWealthAllowance:number,
    prefix:string,
	suffix:string
}
const currencyService = new CurrencyService();
const allRecognisedCurrencies = currencyService.currencies();
const zakatFreeWealthAllowanceInUsd:number=15000;
   
const currencies = allRecognisedCurrencies.map(rCurrency=>{
    return{
      suffix:rCurrency.threeLetterCode,
      prefix:rCurrency.symbol,
      name:rCurrency.name,
      personalWealthAllowance:Math.ceil(zakatFreeWealthAllowanceInUsd*rCurrency.usdRate)
    }
  });
var currencyDictionary:{[id: string]:currency}={};
  for (var i = 0; i < currencies.length; ++i) {
    currencyDictionary[currencies[i].suffix] = currencies[i];
  }
  
export const FormattedCurrencyAmount=(props:{value:number,currencyName:string})=>{
    const currency=currencyDictionary[props.currencyName];
    const outputText= currency.prefix + props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ("+currency.suffix+")";
    return (<>{outputText}</>)
}

export const AssetRow=(props:{asset:asset, currencyName:string, remove:(asset:asset)=>void})=>{
    return (
            <tr>
                <td>
                    {props.asset.description}
                </td>
                <td>
                    <FormattedCurrencyAmount currencyName={props.currencyName} value={props.asset.amount} />
                </td>
                <td className="text-right">
                    <Button  onClick={()=>props.remove(props.asset)}>remove</Button>
                </td>
            </tr>
    )
}


export const DebtRow=(props:{debt:debt, currencyName:string, remove:(debt:debt)=>void})=>{
    return (
            <tr>
                <td>
                    {props.debt.description}
                </td>
                <td>
                    <FormattedCurrencyAmount currencyName={props.currencyName} value={props.debt.amount} />
                </td>
                <td className="text-right">
                    <Button  onClick={()=>props.remove(props.debt)}>remove</Button>
                </td>
            </tr>
    )
}
class Guid {
    static create() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }

export const AddAsset=(props:{currencyName:string,addAsset:(asset:asset)=>void})=>{
    const [description,setDescription]=useState("");
    const [amount,setAmount]=useState("");
    const currency=currencyDictionary[props.currencyName];
    
    const add=()=>{
        props.addAsset({amount:Number(amount),description, id:Guid.create().toString()});
        setAmount("");
        setDescription("");
    }
    const canAdd=()=>{
        return amount&& Number(amount)>0 && description.length>0
    }
    return (
        <div className="flex flex-row items-center">
			<div className="flex-grow">
                <SelectList 
                    selectedOptionKeyValue={description}
                    onChange={(val)=>setDescription(val)}
                    options={[
                        {content:"select an asset type",keyValue:""},
                        {content:"Residential Property",keyValue:"Residential Property"},
                        {content:"Personal Transport",keyValue:"Personal Transport"},
                        {content:"Money You Have",keyValue:"Money You Have"},
                        {content:"Money Owed to You",keyValue:"Money Owed to You"},
                        {content:"Investments",keyValue:"Investments"},
                        {content:"Other Possessions",keyValue:"Other Possessions"},
                    ]}/>						
			</div>
			<div className="flex-grow">
						{currency.prefix!=="" && <span className="">{currency.prefix}</span>}
    					<NumberInput 
                            value={amount} 
                            onChange={val=>setAmount((val??0).toString())} 
						    min={0} 
                            max={1e9} 
                            step={1000} 
                            placeholder="value" />
      						<span className="">{currency.suffix}</span>
						
			</div>
			<div className="flex-shrink">
                {
                     canAdd() &&
				    <Button onClick={add}>Add</Button>
                }
                 {
                     (!canAdd()) &&
				    <span>add asset</span>
                }
			</div>
		</div>
    )
};


export const AddDebt=(props:{currencyName:string,addDebt:(debt:debt)=>void})=>{
    const [description,setDescription]=useState("");
    const [amount,setAmount]=useState("");
    const currency=currencyDictionary[props.currencyName];
    
    const add=()=>{
        props.addDebt({amount:Number(amount),description, id:Guid.create().toString()});
        setAmount("");
        setDescription("");
    }
    const canAdd=()=>{
        return amount&& Number(amount)>0 && description.length>0
    }
    return (
        <div className="flex flex-row items-center">
			<div className="flex-grow">
                <SelectList 
                    selectedOptionKeyValue={description}
                    onChange={(val)=>setDescription(val)}
                    options={[
                        {content:"select an asset type",keyValue:""},
                        {content:"Mortgage",keyValue:"Mortgage"},
                        {content:"Loan",keyValue:"Loan"},
                        {content:"Taxes Due",keyValue:"Taxes Due"},
                        {content:"Other",keyValue:"Other"},
                    ]}/>						
			</div>
			<div className="flex-grow">
						{currency.prefix!=="" && <span className="">{currency.prefix}</span>}
    					<NumberInput 
                            value={amount} 
                            onChange={val=>setAmount((val??0).toString())} 
						    min={0} 
                            max={1e9} 
                            step={1000} 
                            placeholder="value" />
      						<span className="">{currency.suffix}</span>
						
			</div>
			<div className="flex-shrink">
                {
                     canAdd() &&
				    <Button onClick={add}>Add</Button>
                }
                 {
                     (!canAdd()) &&
				    <span>add debt</span>
                }
			</div>
		</div>
    )
};



export const ZakatCalculator=()=>{
    const [selectedCurrencyCode,setSelectedCurrencyCode]=useLocalStorage("ShariahStandards-Zakat-Currency","USD");
    const [dependents,setDependents]=useLocalStorage<number>("ShariahStandards-Zakat-Dependents",0);
    const [assets,setAssets]=useLocalStorage<asset[]>("ShariahStandards-Zakat-Assets",[]);
    const [debts,setDebts]=useLocalStorage<debt[]>("ShariahStandards-Zakat-Debts",[]);

    const addAsset=(asset:asset)=>{
        var newAssets=assets.concat([asset]);
        setAssets(newAssets);            
    }    
    const addDebt=(debt:debt)=>{
        var newDebts=debts.concat([debt]);
        setDebts(newDebts);            
    }    
    const removeAsset=(asset:asset)=>{
        var newAssets = assets.filter(a=>a.id!==asset.id);
        setAssets(newAssets);
    }
    const removeDebt=(debt:debt)=>{
        var newDebts = debts.filter(a=>a.id!==debt.id);
        setDebts(newDebts);
    }
    
    const zakatFreeWealthAllowance=()=>{
        var currency=currencyDictionary[selectedCurrencyCode];
        return Math.ceil((1+dependents)*currency.personalWealthAllowance);
    }
    const zakatableWealthTotal=()=>{
        return Math.max(0,allAssets() -allDebts() - zakatFreeWealthAllowance())
      }
    const sum=(parts:number[]):number=>{
        return [0].concat(parts).reduce(function(a,b){
            return a+b;
        });
      }
    const allAssets=()=>{ 
        return sum(assets.map(function(asset){
            return Math.ceil(asset.amount);
        }));
    }
    const allDebts=()=>{ 
        return sum(debts.map(function(debt){
            return Math.ceil(debt.amount);
        }));
    }
  
    const zakatDuePerMonth=()=>{
        return Math.ceil(zakatableWealthTotal()/(40.0*12));
    }
    return (
    <PageContainer>
        <PageHeading>Zakat Calculator</PageHeading>
        <div className="flex flex-col">
            <div>
                <label>Calculation Currency</label>
                <SelectList 
                    selectedOptionKeyValue={selectedCurrencyCode} 
                    onChange={(value)=>setSelectedCurrencyCode(value)}
                    options={currencies.map(c=>{return {content:c.name,keyValue:c.suffix}})}
                />
            </div>
        <div>  
            <SectionHeading>Zakat Free Wealth Allowance</SectionHeading>
            <div className="flex flex-row items-center">
                <div className="w-1/2">
                    <label>Number of your dependents</label>
                    <NumberInput value={dependents.toString()} min={0} max={100} step={1} onChange={value=>setDependents(Number(value))}/>
                </div>
                <div className="w-1/2">
                    <FormattedCurrencyAmount currencyName={selectedCurrencyCode} value={zakatFreeWealthAllowance()} />
                </div>
            </div>
        </div>
        <div className="shadow-md border-1 p-2 bg-green-100 mb-2">
            <SectionHeading>Assets of you and your dependents</SectionHeading>
            <div className="w-full">   
                { assets.length>0 && 
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th className="money">Value</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map(asset=>
                            <AssetRow key={asset.id} currencyName={selectedCurrencyCode} asset={asset} remove={(asset)=>removeAsset(asset)}/>
                        )}
                    </tbody>
                </table>}
            </div>
            <div className="flex flex-row">
                <div className="w-full">
                    <AddAsset currencyName={selectedCurrencyCode} addAsset={addAsset}/>
                </div>
            </div>
        </div>
        <div className="shadow-md border-1 p-2 bg-red-100 mb-2">

		<div className="col-md-12">
			<SectionHeading>Debts of you and your dependents</SectionHeading>

            {debts.length>0 &&
		 	 <table className="w-full table-auto text-left">
              <thead>
                  <tr>
                      <th>Description</th>
                      <th className="money">Value</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                    {debts.map(debt=>
                        <DebtRow key={debt.id} currencyName={selectedCurrencyCode} debt={debt} remove={(debt)=>removeDebt(debt)}/>
                    )}
              </tbody>
          </table>}
          <AddDebt currencyName={selectedCurrencyCode} addDebt={addDebt}/>
            
        </div>
    </div>

<div className="w-full">
	<table className="w-full table-auto text-left">
        <tbody>
        <tr>
            <td>Total Assets</td><td className="money">
                <FormattedCurrencyAmount value={allAssets()} currencyName={selectedCurrencyCode}/>
            </td>
        </tr>
        <tr>
            <td>Total Debts</td><td className="money">
                -<FormattedCurrencyAmount value={allDebts()} currencyName={selectedCurrencyCode}/>
            </td>
        </tr>
        <tr>
            <td>Wealth Allowance</td><td className="money">
                -<FormattedCurrencyAmount value={zakatFreeWealthAllowance()} currencyName={selectedCurrencyCode}/>
            </td>
        </tr>
        <tr>
            <td>Zakatable Wealth</td><td className="money">
                <FormattedCurrencyAmount value={zakatableWealthTotal()} currencyName={selectedCurrencyCode}/>
            </td>
        </tr>
    </tbody>
	</table>
	<div className="text-3xl text-center border-1 shadow-md bg-yellow-100 my-2 p-2">Zakat due per month is &nbsp;
        <FormattedCurrencyAmount value={zakatDuePerMonth()} currencyName={selectedCurrencyCode}/>    
    </div>
</div>
</div>
</PageContainer>)
};