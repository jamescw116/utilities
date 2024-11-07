const fnFrimZero = (s: string): number => {
    const n: number = parseFloat(s);

    return isNaN(n) ? 0 : n;
}

const Input: React.FC<{
    value?: number
    , readonly?: boolean
    , fnOnChange?: (param: number) => void
}> = ({ value, readonly, fnOnChange }) => (
    <input type="number" step="0.01" value={Number(value).toString()}
        className="text-2xl text-right w-full bg-transparent"
        onChange={(e) => { if (fnOnChange) { fnOnChange(fnFrimZero(e.currentTarget.value)) } }}
        {...readonly ? { readOnly: true } : {}}
    />
)

export default Input;