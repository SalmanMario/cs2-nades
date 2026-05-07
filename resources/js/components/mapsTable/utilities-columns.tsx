import { ColumnDef } from "@tanstack/react-table"
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
import {UtilityTable} from "@/types/Utility";

export const utilitiesColumns: ColumnDef<UtilityTable>[] = [
    {
        accessorKey: "grenade_name",
        header: () => {
            return (
                <div>
                    Grenade Name
                </div>
            )
        },
        cell: ({row}) => {
            const { grenade_name } = row.original;
            return (
                <div className="text-center">{grenade_name}</div>
            )
        }
    },
    {
        accessorKey: "team_type",
        header: ({column}) => {
            return (
                <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Team
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const { team_type } = row.original;
            return (
                <div className="text-center">{team_type}</div>
            )
        }
    },
    {
        accessorKey: "utility_type",
        header: ({column}) => {
            return (
                <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Utility Type
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const { utility_type } = row.original;
            return (
                <div className="text-center">{utility_type}</div>
            )
        }
    },
    {
        accessorKey: "technique_type",
        header: () => {
            return (
                <div>
                    Technique Type
                </div>
            )
        },
        cell: ({row}) => {
            const { technique_type } = row.original;
            return (
                <div className="text-center">{technique_type}</div>
            )
        }
    },
    {
        accessorKey: "movement_type",
        header: () => {
            return (
                <div>
                    Movement Type
                </div>
            )
        },
        cell: ({row}) => {
            const { movement_type } = row.original;
            return (
                <div className="text-center">{movement_type}</div>
            )
        }
    },
    {
        id: "start_coords",
        header: "Start Coordinates",
        cell: ({ row }) => {
            const { start_coords_x, start_coords_y, start_coords_title_from } = row.original;
            return (
                <div>
                    <span>X: {start_coords_x}</span>
                    <span className="ms-5">Y: {start_coords_y}</span>
                    <p className="text-center mt-3">{start_coords_title_from}</p>
                </div>
            )
        }
    },
    {
        id: "end_coords",
        header: "End Coordinates",
        cell: ({ row }) => {
            const { end_coords_x, end_coords_y, end_coords_title_to } = row.original;
            return (
                <div>
                    <span>X: {end_coords_x}</span>
                    <span className="ms-5">Y: {end_coords_y}</span>
                    <p className="text-center mt-3">{end_coords_title_to}</p>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({row}) => {
            const action = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(action.id)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
