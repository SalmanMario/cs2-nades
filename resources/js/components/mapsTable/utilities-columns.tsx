import {ColumnDef} from "@tanstack/react-table"
import {Button} from "@/components/ui/button";
import {ArrowUpDownIcon, MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {UtilityTable} from "../../types/utility";
import {NavigateFn} from "@tanstack/react-router";

export const utilitiesColumns = (navigate: NavigateFn, mapName: string): ColumnDef<UtilityTable>[] => [
    {
        accessorKey: "grenade_name",
        header: () => {
            return (
                <div className="text-left ps-2">
                    Grenade Name
                </div>
            )
        },
        cell: ({row}) => {
            const {grenade_name} = row.original;
            return (
                <div className="text-left ps-2">{grenade_name}</div>
            )
        }
    },
    {
        accessorKey: "team_type",
        header: ({column}) => {
            return (
                <div className="text-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Team
                        <ArrowUpDownIcon className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => {
            const {team_image} = row.original;
            return (
                <div className="flex items-center justify-center">
                    <img src={team_image} className="w-8 h-8 rounded-full ml-2"/>
                </div>
            )
        }
    },
    {
        accessorKey: "utility_type",
        header: ({column}) => {
            return (
                <div className="text-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Utility Type
                        <ArrowUpDownIcon className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => {
            const {utility_image} = row.original;
            return (
                <div className="flex items-center justify-center">
                    <img src={utility_image} className="w-8 h-8 rounded-full ml-2"/>
                </div>
            )
        }
    },
    {
        accessorKey: "technique_type",
        header: () => {
            return (
                <div className="text-center">
                    Technique Type
                </div>
            )
        },
        cell: ({row}) => {
            const {technique_type} = row.original;
            return (
                <div className="text-center">
                    <span
                        className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-emerald-600/50">
                        {technique_type}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "movement_type",
        header: () => {
            return (
                <div className="text-center">
                    Movement Type
                </div>
            )
        },
        cell: ({row}) => {
            const {movement_type} = row.original;
            return (
                <div className="text-center">
                    <span
                        className="inline-flex items-center rounded-md bg-yellow-300/20 px-2 py-1 text-xs font-medium text-yellow-300 inset-ring inset-ring-orange-300/50">
                        {movement_type}
                    </span>
                </div>
            )
        }
    },
    {
        id: "start_coords",
        header: () => {
            return (
                <div className="text-center">
                    Start Coordinates
                </div>
            )
        },
        cell: ({row}) => {
            const {start_coords} = row.original;
            return (
                <div>
                    <div className="flex justify-center">
                        <span className="font-bold">X: {start_coords.x}</span>
                        <span className="ms-5 font-bold">Y: {start_coords.y}</span>
                    </div>
                    <p className="text-center mt-3">{start_coords.title}</p>
                </div>
            )
        }
    },
    {
        id: "end_coords",
        header: () => {
            return (
                <div className="text-center">
                    End Coordinates
                </div>
            )
        },
        cell: ({row}) => {
            const {end_coords} = row.original;
            return (
                <div>
                    <div className="flex justify-center">
                        <span className="font-bold">X: {end_coords.x}</span>
                        <span className="ms-5 font-bold">Y: {end_coords.y}</span>
                    </div>
                    <p className="text-center mt-3">{end_coords.title}</p>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: () => {
            return (
                <div className="text-right pe-2">
                    Actions
                </div>
            )
        },
        cell: ({row}) => {
            const action = row.original;
            return (
                <div className="flex items-center justify-end pe-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigate({
                                    to: "/admin/dashboard/maps/$mapName/$id/edit",
                                    params: {mapName, id: String(action.id)}
                                })}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]
