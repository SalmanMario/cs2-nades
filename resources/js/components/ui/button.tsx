import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                outline:
                    "border border-input shadow-sm hover:bg-accent hover:text-accent-foreground",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            intent: {
                "primary": "",
                "success": "",
                "info": "",
                'danger': "",
                'warning': "",
                'white': "",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        compoundVariants: [
            {
                variant: "default",
                intent: "info",
                className: "bg-cyan-500 text-white hover:bg-cyan-400"
            },
            {
                variant: "default",
                intent: "danger",
                className: "bg-red-500 hover:bg-red-600"
            },
            {
                variant: "default",
                intent: "warning",
                className: "bg-yellow-400 hover:bg-yellow-500"
            },
            {
                variant: "default",
                intent: "success",
                className: "bg-emerald-400 hover:bg-emerald-500"
            },
            {
                variant: "default",
                intent: "white",
                className: "bg-slate-50 text-black hover:bg-slate-100"
            },
            {
                variant: "default",
                intent: "primary",
                className: "bg-zinc-700 text-white hover:bg-zinc-600"
            },
            {
                variant: "outline",
                intent: "info",
                className: "outline-2 outline-cyan-500 hover:outline-cyan-400"
            },
            {
                variant: "outline",
                intent: "danger",
                className: "outline-2 outline-red-500 hover:outline-red-600"
            },
            {
                variant: "outline",
                intent: "warning",
                className: "outline-2 outline-yellow-400 hover:outline-yellow-500"
            },
            {
                variant: "outline",
                intent: "success",
                className: "outline-2 outline-emerald-400 hover:outline-emerald-500"
            },
            {
                variant: "outline",
                intent: "white",
                className: "outline-2 outline-slate-50 text-white hover:outline-slate-100"
            },
            {
                variant: "outline",
                intent: "primary",
                className: "outline-2 outline-zinc-700 text-white hover:outline-zinc-600"
            },
        ],

        defaultVariants: {
            variant: "default",
            intent: "primary",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, intent, size, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({variant, intent, size, className}))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export {Button, buttonVariants}
