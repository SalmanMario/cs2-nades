import {MapIcon} from "lucide-react";

type StatCardProps = {
    label: string;
    value: number;
    image?: string;
    color?: string;
};

export default function StatCard({label, value, image, color = "text-white"}: StatCardProps) {
    return (
        <div className="group rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-zinc-900">

            <div className="flex items-center gap-3">

                {image ? (
                    <img
                        src={image}
                        alt={label}
                        className="h-9 w-9 object-contain"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-lg">
                        <MapIcon/>
                    </div>
                )}

                <div>
                    <p className={`text-2xl font-bold ${color}`}>
                        {value}
                    </p>

                    <p className="text-sm text-zinc-400">
                        {label}
                    </p>
                </div>

            </div>
        </div>
    );
}
