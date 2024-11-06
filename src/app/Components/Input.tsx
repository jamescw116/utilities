const Input: React.FC<{
    value?: number
    , readonly?: boolean
    , fnOnChange?: (param: string) => void
}> = ({ value, readonly, fnOnChange }) => (
    <input type="number" step="0.01" value={isNaN(value ?? 0) ? 0 : value}
        className="text-2xl text-right w-full"
        onChange={(e) => { if (fnOnChange) { fnOnChange(e.currentTarget.value) } }}
        {...readonly ? { readOnly: true } : {}}
    />
)

export default Input;