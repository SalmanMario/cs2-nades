export default function UtilityCounter({count, type, text}: { count: number, type: string, text: string }) {
    const getStyle = () => {
        let className = null
        switch (type) {
            case "any":
                className = "bg-white/10 px-2 py-1 border-2 border-amber-50"
                break;
            case "ct":
                className = "bg-blue-400/10 px-2 py-1 border-2 border-blue-500"
                break;
            case "t":
                className = "bg-orange-400/10 px-2 py-1 border-2 border-orange-500"
                break;
        }
        return className
    }
    return (
        <div>
            <div className={`${getStyle()} px-5 py-5`}>
                <h1 className="text-2xl mb-5">{text}</h1>
                <p className="text-3xl">{count}</p>
            </div>
        </div>
    )
}
