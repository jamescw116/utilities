"use client"

import { useState } from "react";

import UnitConvert from "./Utilities/UnitConvert";

const UtilitiesMap: { [key: number]: JSX.Element } = {
    1: <UnitConvert />
}

const Page: React.FC = () => {
    const [id, setId] = useState<number>(1);


    return (
        <>
            {UtilitiesMap[id] || <></>}
        </>
    )
}

export default Page;