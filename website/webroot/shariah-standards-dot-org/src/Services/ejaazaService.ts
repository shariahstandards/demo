import { create } from 'zustand'
//const ejaazaUrlBase="https://dev.ejaaza.com:3000/";
export interface EjaazaPermission{
    uniqueName:string,
    certificationToken?:string,
    properties?:{}
    //availablePermissions:string[],
   
}
export interface EjaazaState{
    getPermission:(permissionName:string)=>void,
    permissions:{[index:string]:EjaazaPermission},
    
}
//temp storage here needs reloading from ejaaza.com after permissionUpdateEvent


export const useEjaazaPermissions = create<EjaazaState>(
    (set,get) => 
    ({   
        permissions:{},
        getPermission:async (pemissionName)=>{
                //TODO trigger get permission from ejaaza.com
                let newPermissions = get().permissions;
                newPermissions[pemissionName]={uniqueName:pemissionName}
                set({permissions:newPermissions})
            }
        ,
    })
)