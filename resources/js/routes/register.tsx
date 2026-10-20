import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router'
import React from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@/AuthContext";
import {pageTitle} from "@/hooks/helper";
import AuthCard, {authInputClass, parseAuthError} from "@/components/card/AuthCard";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/register')({
    head: () => ({meta: [{title: pageTitle("Create account")}]}),
    beforeLoad: async ({context}) => {
        const auth: AuthContext = (context as { auth: AuthContext }).auth;
        const user: User | null = auth.user ?? (await auth.loadUser());

        if (user) {
            throw redirect({to: "/"});
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {register: registerUser} = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: {errors, isSubmitting}
    } = useForm<Register>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        }
    });

    const onSubmit = async (data: Register) => {
        try {
            await registerUser(data);
            // favorites were cached as "not logged in"
            await queryClient.invalidateQueries({queryKey: ['favorites']});
            await navigate({to: "/"});
        } catch (error) {
            const {message, fields} = parseAuthError(error);
            Object.entries(fields).forEach(([field, messages]) => {
                setError(field as keyof Register, {message: messages[0]})
            })
            if (Object.keys(fields).length === 0) setError("root", {message});
        }
    }

    return (
        <AuthCard
            title="Create account"
            subtitle="Sign up to save lineups to your favorites."
            footer={<>Already have an account? <Link to="/login" className="text-orange-400 hover:text-orange-300">Log in</Link></>}
        >
            <form onSubmit={(e) => {
                clearErrors();
                handleSubmit(onSubmit)(e);
            }} className="flex flex-col gap-5">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" autoComplete="name" className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.name}
                           {...register('name', {
                               required: "Name is required",
                               maxLength: {value: 255, message: "Name is too long"},
                           })}/>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" autoComplete="email" className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.email}
                           {...register('email', {required: "Email is required"})}/>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" autoComplete="new-password" className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.password}
                           {...register('password', {
                               required: "Password is required",
                               minLength: {value: 8, message: "Password must be at least 8 characters"},
                           })}/>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <Input id="password_confirmation" type="password" autoComplete="new-password"
                           className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.password_confirmation}
                           {...register('password_confirmation', {
                               required: "Please confirm your password",
                               validate: (value, values) => value === values.password || "Passwords do not match",
                           })}/>
                    {errors.password_confirmation &&
                        <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>}
                </div>

                {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

                <Button type="submit" disabled={isSubmitting}
                        className="h-11 rounded-xl bg-orange-500 text-base text-black hover:bg-orange-400">
                    {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
            </form>
        </AuthCard>
    )
}
