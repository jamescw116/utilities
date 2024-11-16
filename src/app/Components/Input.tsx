const fnToNumber = (s: string): number => {
    const n: number = parseFloat(s);

    return isNaN(n) ? 0 : n;
}

const Input: React.FC<{
    value?: number
    , classNames?: Array<string>
    , readonly?: boolean
    , fnOnChange?: (param: number) => void
}> = ({ value, classNames = [], readonly, fnOnChange }) => (
    <input type="number" step="0.01" value={Number(value).toString()}
        className={`text-right w-full text-3xl bg-transparent ${classNames.join(" ")}`}
        onChange={(e) => { if (fnOnChange) { fnOnChange(fnToNumber(e.currentTarget.value)) } }}
        onFocus={(e) => { e.target.select(); } } 
        {...readonly ? { readOnly: true } : {}}
    />
)

export default Input;