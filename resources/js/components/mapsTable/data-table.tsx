"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from "react";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Field, FieldLabel} from "@/components/ui/field";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({columns, data,}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        }
    })

    return (
        <div className="overflow-hidden rounded-md border">
            <div className="flex items-end gap-4 py-4">
                <Field className="w-full max-w-sm">
                    <FieldLabel htmlFor="grenade_input">Grenade Name</FieldLabel>
                    <Input
                        placeholder="Search by name..."
                        value={(table.getColumn("grenade_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("grenade_name")?.setFilterValue(event.target.value)
                        }
                    />
                </Field>

                <Field className="w-48">
                    <FieldLabel htmlFor="team_type">Team Type</FieldLabel>
                    <Select
                        onValueChange={(value) =>
                            table.getColumn('team_type')?.setFilterValue(value === "All" ? undefined : value)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Team"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Teams</SelectLabel>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="CT">CT</SelectItem>
                                <SelectItem value="T">T</SelectItem>
                                <SelectItem value="ANY">ANY</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <Field className="w-48">
                    <FieldLabel htmlFor="utility_type">Utility Type</FieldLabel>
                    <Select
                        onValueChange={(value) =>
                            table.getColumn('utility_type')?.setFilterValue(value === "All" ? undefined : value)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Utility"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Utility Type</SelectLabel>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="FLASH">Flash</SelectItem>
                                <SelectItem value="INCENDIARY">Incendiary</SelectItem>
                                <SelectItem value="HE_GRENADE">Grenade</SelectItem>
                                <SelectItem value="SMOKE">Smoke</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
