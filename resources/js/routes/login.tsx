import {createFileRoute, Link, redirect, useRouter} from '@tanstack/react-router'
import React from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@/AuthContext";
import {pageTitle} from "@/hooks/helper";
import AuthCard, {authInputClass, parseAuthError} from "@/components/card/AuthCard";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type LoginSearch = {
    redirect?: string,
}

export const Route = createFileRoute('/login')({
    head: () => ({meta: [{title: pageTitle("Login")}]}),
    validateSearch: (search: Record<string, unknown>): LoginSearch => ({
        // only paths inside the app, so the link can't send users to another site
        redirect: typeof search.redirect === "string" && search.redirect.startsWith("/") && !search.redirect.startsWith("//")
            ? search.redirect
            : undefined,
    }),
    beforeLoad: async ({context, search}) => {
        const auth: AuthContext = (context as { auth: AuthContext }).auth;
        const user: User | null = auth.user ?? (await auth.loadUser());

        if (user) {
            throw redirect({href: search.redirect ?? "/"});
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {login} = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const {redirect: redirectTo} = Route.useSearch();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: {errors, isSubmitting}
    } = useForm<Login>({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: Login) => {
        try {
            await login(data);
            // favorites were cached as "not logged in"
            await queryClient.invalidateQueries({queryKey: ['favorites']});
            router.history.push(redirectTo ?? "/");
        } catch (error) {
            setError("root", {message: parseAuthError(error).message});
        }
    }

    return (
        <AuthCard
            title="Login"
            subtitle="Welcome back! Log in to access your favorite lineups."
            footer={<>Don't have an account? <Link to="/register" className="text-orange-400 hover:text-orange-300">Create one</Link></>}
        >
            <form onSubmit={(e) => {
                clearErrors();
                handleSubmit(onSubmit)(e);
            }} className="flex flex-col gap-5">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" autoComplete="email" className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.email}
                           {...register('email', {required: "Email is required"})}/>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" autoComplete="current-password" className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.password}
                           {...register('password', {required: "Password is required"})}/>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

                <Button type="submit" disabled={isSubmitting}
                        className="h-11 rounded-xl bg-orange-500 text-base text-black hover:bg-orange-400">
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </AuthCard>
    )
}
