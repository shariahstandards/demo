import { create } from 'zustand'
import { appConfig } from '../appConfig'

export interface StoreState{
    config:appConfig|undefined,
    load:()=>void
}
export const useStore = create<StoreState>(
    (set,get) => 
    ({
        config:undefined,
        load:async ()=>{
            var response = await fetch("config.json");
            var responseObject =await response.json() as appConfig;
            set({config:responseObject});
        }
    }
    )
)