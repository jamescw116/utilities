"use client"

import { useState } from "react";

import Input, { TInputValue } from "../Components/Input";

const UnitWeight = ["g", "kg", "lb", "oz"] as const;
const UnitCapacity = ["ml", "l", "cup", "tsp", "tbsp", "pint", "qt", "gal"] as const;
const UnitTemperature = ["°C", "°F"] as const;
const Unit = [
    ...UnitWeight
    , ...UnitCapacity
    , ...UnitTemperature
] as const;
type TUnit = typeof Unit[number];

type TConvertDetail = { [unit in TUnit]?: (v: number) => number }
type TConvert = { [toUnit in TUnit]?: TConvertDetail }

const Convert: TConvert = {
    "g": {
        "kg": (v: number) => (v * 1000)
        , "lb": (v: number) => (v * 453.59)
        , "oz": (v: number) => (v * 28.35)
    }
    , "ml": {
        "l": (v: number) => (v * 1000)
        , "cup": (v: number) => (v * 236.59)
        , "tsp": (v: number) => (v * 4.93)
        , "tbsp": (v: number) => (v * 14.79)
        , "pint": (v: number) => (v * 473.18)
        , "qt": (v: number) => (v * 946.35)
        , "gal": (v: number) => (v * 3785.41)
    }
    , "°C": {
        "°F": (v: number) => ((v - 32) * 5 / 9)
    }
}

const fnGetToUnit = (nUnit: TUnit): TUnit => (
    Object.keys(Convert).find((u: string) => (
        u === nUnit
        || Object.keys(Convert[u as keyof TConvert] as TConvertDetail).find((su) => (su === nUnit))
    )) as TUnit
)

const fnConvert = (value: number, unit: TUnit, toUnit: TUnit): number => {
    const fn = (Convert[toUnit as keyof TConvert] as TConvertDetail)[unit as keyof TConvertDetail]

    return fn !== undefined ? fn(value) : value;
};

const fnGetPriceRate = (price: number, value: number, unit: TUnit, toUnit: TUnit): number => {
    const f = parseFloat((value === 0 ? 0 : ((price / value) / fnConvert(1, unit, toUnit) * 100)).toFixed(3));

    return isNaN(f) ? 0 : f;
}

const UnitConvertComp: React.FC<{
    inputPrefix: React.ReactNode
    , inputValue: React.ReactNode
    , inputUnit: React.ReactNode

    , resultPrefix: string
    , resultValue: string
    , resultUnit: string
}> = ({ inputPrefix, inputValue, inputUnit, resultPrefix, resultValue, resultUnit }) => (
    <div className="flex-1 flex flex-row items-baseline w-full">
        <div className="p-1 w-16p">{inputPrefix}</div>
        <div className="p-1 flex-1">{inputValue}</div>
        <div className="p-1 w-64p">{inputUnit}</div>

        <div className="p-1 w-24p text-3xl">=</div>

        <div className="p-1 w-16p text-sm">{resultPrefix}</div>
        <div className="p-1 flex-1 text-3xl text-green-500 font-bold text-right overflow-hidden">{resultValue}</div>
        <div className="p-1 w-64p text-sm">{resultUnit}</div>
    </div>
)

const UnitConvert: React.FC = () => {
    const [price, setPrice] = useState<number>(0);
    const [value, setValue] = useState<number>(1);
    const [fmUnit, setFmUnit] = useState<TUnit>("lb");

    const [toValue, setToValue] = useState<number>(fnConvert(1, "lb", Unit[0]));
    const [toUnit, setToUnit] = useState<TUnit>(Unit[0]);

    const [priceRate, setPriceRate] = useState<number>(0);
    const [priceRateBase, setPriceRateBase] = useState<string>("/ 100g");

    const fnEditPrice = (price: number) => {
        setPrice(price);
        setPriceRate(fnGetPriceRate(price, 1, fmUnit, toUnit));
    }

    const fnEditValue = (param: { value?: number, unit?: TUnit }) => {
        let nToVal: number;

        if (param.value !== undefined) {
            const nVal = param.value ?? 0;
            setValue(nVal);
            nToVal = fnConvert(nVal, fmUnit, toUnit);
            setToValue(nToVal);
        }
        else if (param.unit !== undefined) {
            const nUnit: TUnit = param.unit;
            const nToUnit: TUnit = fnGetToUnit(nUnit);
            setFmUnit(nUnit);
            setToUnit(nToUnit);

            nToVal = fnConvert(value, nUnit, nToUnit);
            setToValue(nToVal);

            setPriceRateBase(`/ 100${nToUnit}`);
            setPriceRate(fnGetPriceRate(price, 1, nUnit, nToUnit));
        }
    }

    return (
        <div className="flex flex-col p-2">
            <UnitConvertComp
                inputPrefix={<>&nbsp;</>}
                inputValue={<Input value={value} fnOnChange={(nValue: TInputValue) => fnEditValue({ value: Number(nValue) })} />}
                inputUnit={<select value={fmUnit} className="w-full bg-transparent" onChange={(e) => fnEditValue({ unit: e.currentTarget.value as TUnit })}>
                    <option disabled className="bg-transparent">- Wgt -</option>
                    {[...UnitWeight].map((u: string) => <option key={u} className="bg-transparent" value={u}>{u}</option>)}

                    <option disabled className="bg-transparent">- Cap -</option>
                    {[...UnitCapacity].map((u: string) => <option key={u} className="bg-transparent" value={u}>{u}</option>)}

                    <option disabled className="bg-transparent">- Temp -</option>
                    {[...UnitTemperature].map((u: string) => <option key={u} className="bg-transparent" value={u}>{u}</option>)}
                </select>}

                resultPrefix=""
                resultValue={toValue.toFixed(3)}
                resultUnit={toUnit}
            />

            <UnitConvertComp
                inputPrefix={<>$</>}
                inputValue={<Input value={price} fnOnChange={(nPrice: TInputValue) => fnEditPrice(Number(nPrice))} />}
                inputUnit={<>/ 1 {fmUnit}</>}

                resultPrefix={"$"}
                resultValue={priceRate.toFixed(3)}
                resultUnit={priceRateBase}
            />

            <UnitConvertComp
                inputPrefix={<>&nbsp;</>}
                inputValue={<>&nbsp;</>}
                inputUnit={<>&nbsp;</>}

                resultPrefix={"$"}
                resultValue={(value * price).toFixed(3)}
                resultUnit=""
            />
        </div>
    )
}

export default UnitConvert;