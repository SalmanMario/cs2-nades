import React from "react";
import {AxiosError} from "axios";
import FrontendNavbar from "@/components/navbar/FrontendNavbar";
import Footer from "@/components/footer/Footer";

export type FieldErrors = Record<string, string[]>;

// Splits an API error into a general message and Laravel's per-field validation errors
export function parseAuthError(error: unknown): {message: string, fields: FieldErrors} {
    if (error instanceof AxiosError) {
        return {
            message: error.response?.data?.message ?? "Something went wrong, please try again.",
            fields: error.response?.data?.errors ?? {},
        };
    }
    return {message: "Something went wrong, please try again.", fields: {}};
}

export const authInputClass = "h-11 rounded-xl border-zinc-700 bg-zinc-900/80 text-base placeholder:text-zinc-500";

export default function AuthCard({title, subtitle, children, footer}: {
    title: string,
    subtitle: string,
    children: React.ReactNode,
    footer: React.ReactNode,
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#0d0f14]">
            <FrontendNavbar/>

            <div className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
                    <h1 className="text-4xl font-bold text-white">{title}</h1>
                    <p className="mt-2 text-zinc-400">{subtitle}</p>

                    <div className="mt-8">{children}</div>

                    <div className="mt-6 text-center text-sm text-zinc-400">{footer}</div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}
