const Loading: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
    <div className={`flex items-center justify-center p-2 ${isLoading ? "" : "hidden"}`}>
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent border-solid rounded-full animate-spin">
            &nbsp;
        </div>
    </div>
)

export default Loading;