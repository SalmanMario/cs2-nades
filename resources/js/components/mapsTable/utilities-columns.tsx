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

export type Payment = {
    id: string
    name: string
    team: string
    utility: string
    actions?: any,
}

export const utilitiesColumns: ColumnDef<Payment>[] = [
    {
        accessorKey: "name",
        header: ({column}) => {
            return (
                <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "team",
        header: ({column}) => {
            return (
                <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Team
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "utility",
        accessorKey: "utility",
        header: ({column}) => {
            return (
                <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Utility Type
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({row}) => {
            const payment = row.original;

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
                            onClick={() => navigator.clipboard.writeText(payment.id)}
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
