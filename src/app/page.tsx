"use client"

import { useState } from "react";

import UnitConvert from "./Utilities/UnitConvert";
import Translate from "./Utilities/Translate";

const UtilitiesMap: { [key: string]: JSX.Element } = {
    "Price / Unit Convert": <UnitConvert />
    , "Translate": <Translate />
    , "Pending...": <></>
}

const Page: React.FC = () => {
    const [curKey, setCurId] = useState<string>("Price / Unit Convert");

    return (
        <div className="flex flex-col w-full">
            {Object.keys(UtilitiesMap)
                .map((key: string) => (
                    <div key={key} className="flex-1 flex flex-col w-full">
                        <div className="flex-1 border-2 bg-lime-200 text-black cursor-pointer p-1 text-lg"
                            onClick={() => setCurId(p => (p === key ? "" : key))}>+ {key}</div>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${key === curKey ? "max-h-full" : "max-h-0"}`} >
                            {UtilitiesMap[key]}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Page;