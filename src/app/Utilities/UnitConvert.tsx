import { useState } from "react";

import Input from "../Components/Input";

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
        , "cup": (v: number) => (v * 453.59)
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

const UnitConvert: React.FC = () => {
    const [price, setPrice] = useState<number>(0);
    const [value, setValue] = useState<number>(1);
    const [fmUnit, setFmUnit] = useState<TUnit>("lb");

    const [toValue, setToValue] = useState<number>(fnConvert(1, "lb", Unit[0]));
    const [toUnit, setToUnit] = useState<TUnit>(Unit[0]);

    const [priceRate, setPriceRate] = useState<number>(0);
    const [priceRateBase, setPriceRateBase] = useState<string>("/100g");

    const fnEdit = (param: { value?: number, unit?: TUnit, price?: number }) => {
        let nToVal: number;

        if (param.value !== undefined) {
            const nVal = param.value ?? 0;
            setValue(nVal);
            nToVal = fnConvert(nVal, fmUnit, toUnit);
            setToValue(nToVal);
            setPriceRate(fnGetPriceRate(price, nVal, fmUnit, toUnit));
        }
        else if (param.price !== undefined) {
            const nPrice = param.price ?? 0;
            setPrice(nPrice);
            setPriceRate(fnGetPriceRate(nPrice, value, fmUnit, toUnit));
        }
        else if (param.unit !== undefined) {
            const nUnit: TUnit = param.unit;
            const nToUnit: TUnit = fnGetToUnit(nUnit);
            setFmUnit(nUnit);
            setToUnit(nToUnit);

            nToVal = fnConvert(value, nUnit, nToUnit);
            setToValue(nToVal);
            setPriceRate(fnGetPriceRate(price, value, nUnit, nToUnit));
            setPriceRateBase(`/100${nToUnit}`);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-2 w-full max-w-md p-1">
                <div className="flex flex-1 flex-row p-2 items-center">
                    <span className="text-2xl pr-1">$</span>
                    <Input value={price} fnOnChange={(nPrice: number) => fnEdit({ price: nPrice })} />
                </div>

                <div className="flex flex-1 flex-row p-2 items-center">
                <div className="text-2xl pr-1 w-6">/</div>
                <Input value={value} fnOnChange={(nValue: number) => fnEdit({ value: nValue })} />
                    <select value={fmUnit} className="text-xl text-right w-full bg-transparent" onChange={(e) => fnEdit({ unit: e.currentTarget.value as TUnit })}>
                        <option disabled className="bg-transparent">- Wgt -</option>
                        {[...UnitWeight].map((u: string) => <option key={u} className="bg-transparent" value={u}>{u}</option>)}

                        <option disabled className="bg-transparent">- Cap -</option>
                        {[...UnitCapacity].map((u: string) => <option key={u} className="bg-transparent" value={u}>{u}</option>)}

                        <option disabled className="bg-transparent">- Temp -</option>
                        {[...UnitTemperature].map((u: string) => <option key={u} className="bg-transparent" value={u}>{u}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex flex-row gap-2 w-full max-w-md p-1">
                <div className="flex-1 p-2 text-right text-2xl">=</div>

                <div className="flex-1 p-2 flex items-center w-full">
                    <div className="text-3xl text-right flex-1">{toValue}</div>
                    <div className="text-sm text-left p-2 w-12">{toUnit}</div>
                </div>
            </div>

            <div className="flex flex-row gap-2 w-full max-w-md p-1">
                <div className="flex-1 p-2 text-right text-2xl">=</div>

                <div className="flex-1 p-2 flex items-center w-full">
                    <div className="text-3xl pr-1 w-6">$</div>
                    <div className="text-3xl text-right flex-1">{priceRate}</div>
                    <div className="text-sm text-left p-2 w-12">{priceRateBase}</div>
                </div>
            </div>
        </div>
    )
}

export default UnitConvert;