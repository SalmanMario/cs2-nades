import {
    Map,
    Bomb,
    LayoutDashboard,
} from "lucide-react";
import {Link, useNavigate} from "@tanstack/react-router";
import {MapResponse} from "@/types/map";

const menu = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
    },
    {
        title: "Maps",
        icon: Map,
        href: "/admin/dashboard/maps",
    },
    {
        title: "Utilities",
        icon: Bomb,
        href: "/admin/dashboard/maps",
    },
];

export default function BackendSidebar({maps} : {maps?: MapResponse[]}) {
    const navigate = useNavigate();
    const goToMap = (map : string) => {
        navigate({
            to: '/admin/dashboard/maps/$mapName',
            params:{
                mapName: map
            }
        }).then()
    }
    return (
        <aside className="w-[280px] border-r border-zinc-800">

            <div className="flex h-full flex-col">

                {/* Logo */}

                <div className="border-b border-zinc-800 p-8">

                    <h1 className="text-3xl font-bold text-white">
                        CS2 Nades
                    </h1>

                    <p className="mt-1 text-sm uppercase tracking-widest text-orange-500">
                        Admin
                    </p>

                </div>

                {/* Main */}

                <div className="flex-1 px-5 py-8">

                    <p className="mb-4 text-xs uppercase tracking-wider text-zinc-500">
                        Main
                    </p>

                    <div className="space-y-2">

                        {menu.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    to={item.href}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-transparent
                                        px-4
                                        py-3
                                        text-zinc-300
                                        transition-all
                                        hover:border-orange-500/40
                                        hover:bg-zinc-900
                                        hover:text-white
                                    "
                                >
                                    <Icon size={19} />

                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>

                    <p className="mb-4 mt-10 text-xs uppercase tracking-wider text-zinc-500">
                        Maps
                    </p>

                    <div className="space-y-2 px-5">
                        {maps?.map((map) => (
                            <button
                                onClick={() => goToMap(map.name)}
                                key={map.id}
                                className="flex cursor-pointer w-full items-center rounded-lg py-2 text-left text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                            >
                                <img className="w-7 h-7" src={map.image} alt={map.name}/>
                                <span className="ms-5">{map.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

        </aside>
    );
}
