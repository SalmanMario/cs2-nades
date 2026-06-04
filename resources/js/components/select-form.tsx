import {
    Select,
    SelectContent,
    SelectGroup, SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Controller} from "react-hook-form";
import React from "react";
import {Label} from "@/components/ui/label";

type SelectFormProps = {
    name: string,
    label: string,
    placeholder: string,
    control: any,
    children: React.ReactNode
}
export function SelectForm(props: SelectFormProps) {
    return (
        <>
            <Label htmlFor={props.name}>{props.label}</Label>
                <Controller
                    name={props.name}
                    control={props.control}
                    render={({field}) => (
                        <Select key={field.value ?? ""} onValueChange={(val) => field.onChange(val === "none" ? null : val)} value={field.value}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder={"Select a " + props.placeholder}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{props.label + " Type"}</SelectLabel>
                                    <SelectItem value="none">None</SelectItem>
                                    {props.children}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
        </>
    )
}
