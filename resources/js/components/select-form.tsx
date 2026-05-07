import {
    Select,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Controller} from "react-hook-form";
import React from "react";
import {Label} from "@/components/ui/label";

export function SelectForm(props) {
    return (
        <>
            <Label htmlFor={props.name}>{props.label}</Label>
                <Controller
                    name={props.name}
                    control={props.control}
                    render={({field}) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder={"Select a " + props.placeholder}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{props.label + " Type"}</SelectLabel>
                                    {props.children}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
        </>
    )
}
