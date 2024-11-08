const Input: React.FC<{
    value?: number
    , readonly?: boolean
    , fnOnChange?: (param: number) => void
}> = ({ value, readonly, fnOnChange }) => (
    <input type="number" step="0.01" value={Number(value).toString()}
        className="text-2xl text-right w-full bg-transparent"
        onChange={(e) => { if (fnOnChange) { fnOnChange(parseFloat(e.currentTarget.value)) } }}
        onFocus={(e) => { e.target.select(); } } 
        {...readonly ? { readOnly: true } : {}}
    />
)

export default Input;