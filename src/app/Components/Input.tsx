import { DetailedHTMLProps, InputHTMLAttributes } from "react";

const fnToNumber = (s: string): number => {
    const n: number = parseFloat(s);

    return isNaN(n) ? 0 : n;
}

const fnAttr = (type: string): DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> => {
    if (type === "number") {
        return { type: "number" , step: 0.01 }
    }

    return { type: "text" }
}

export type TInputValue = string | number;
export type TFInputOnChange = (v: TInputValue) => void

const Input: React.FC<{
    value?: TInputValue
    , classNames?: Array<string>
    , readonly?: boolean
    , fnOnChange?: TFInputOnChange
}> = ({ value, classNames = [], readonly, fnOnChange }) => (
    <input {...fnAttr(typeof value)} value={typeof value === "string" ? value : Number(value).toString()}
        className={`text-right w-full text-3xl bg-transparent ${classNames.join(" ")}`}
        onChange={(e) => {
            if (fnOnChange) {
                switch (typeof value) {
                    case "string":
                        fnOnChange(e.currentTarget.value);
                        break;
                    case "number":
                        fnOnChange(fnToNumber(e.currentTarget.value))
                        break;
                }
            }
        }}
        onFocus={(e) => { e.target.select(); }}
        {...readonly ? { readOnly: true } : {}}
    />
)

export default Input;