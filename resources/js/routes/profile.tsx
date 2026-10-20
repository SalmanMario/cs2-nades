import {createFileRoute, redirect} from '@tanstack/react-router'
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useAuth} from "@/AuthContext";
import {useMutationApi} from "@/hooks/use-mutation";
import {initials, pageTitle} from "@/hooks/helper";
import FrontendNavbar from "@/components/navbar/FrontendNavbar";
import Footer from "@/components/footer/Footer";
import {authInputClass} from "@/components/card/AuthCard";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/profile')({
    head: () => ({meta: [{title: pageTitle("Profile")}]}),
    beforeLoad: async ({context}) => {
        const auth: AuthContext = (context as { auth: AuthContext }).auth;
        const user: User | null = auth.user ?? (await auth.loadUser());

        if (!user) {
            throw redirect({to: "/login"});
        }

        return {user};
    },
    component: RouteComponent,
})

type ProfileForm = {
    name: string,
    email: string,
}

type PasswordForm = {
    current_password: string,
    password: string,
    password_confirmation: string,
}

type ApiErrors = Error & {
    errors: Record<string, string[]>
}

function RouteComponent() {
    const {user} = useAuth();

    if (!user) return null;

    return (
        <div className="flex min-h-screen flex-col bg-[#0d0f14]">
            <FrontendNavbar/>

            <div className="flex-1">
                <div className="mx-auto max-w-6xl px-8 py-8">
                    <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
                        <div className="flex flex-wrap items-center gap-5">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-orange-500 text-2xl font-semibold text-black">
                                    {initials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                                <p className="mt-1 text-zinc-400">
                                    {user.email} · {user.role === "ADMIN" ? "Admin" : "Member"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <ProfileSection user={user}/>
                        <PasswordSection/>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

function Section({title, text, children}: {title: string, text: string, children: React.ReactNode}) {
    return (
        <section className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-zinc-400">{text}</p>
            <div className="mt-6 flex flex-1 flex-col">{children}</div>
        </section>
    );
}

function ProfileSection({user}: {user: User}) {
    const {loadUser} = useAuth();
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {errors, isDirty}
    } = useForm<ProfileForm>({
        defaultValues: {
            name: user.name,
            email: user.email,
        }
    });

    useEffect(() => {
        reset({name: user.name, email: user.email});
    }, [user]);

    const updateProfile = useMutationApi<{user: User}, ApiErrors, ProfileForm>({
        url: "/profile",
        method: "PUT",
    });

    const onSubmit = (data: ProfileForm) => {
        setSaved(false);
        updateProfile.mutate(data, {
            onSuccess: async () => {
                // refreshes the navbar and the header above
                await loadUser();
                setSaved(true);
            },
            onError: (error) => {
                Object.entries(error.errors).forEach(([field, message]) => {
                    setError(field as keyof ProfileForm, {message: message[0]})
                })
                if (Object.keys(error.errors).length === 0) setError("root", {message: error.message});
            }
        })
    }

    return (
        <Section title="Account details" text="Update your name and email address.">
            <form onSubmit={(e) => {
                clearErrors();
                handleSubmit(onSubmit)(e);
            }} className="flex flex-1 flex-col gap-5">
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

                {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

                <div className="mt-auto flex items-center gap-4">
                    <Button type="submit" disabled={!isDirty || updateProfile.isPending}
                            className="h-11 rounded-xl bg-orange-500 px-6 text-base text-black hover:bg-orange-400">
                        {updateProfile.isPending ? "Saving..." : "Save changes"}
                    </Button>
                    {saved && !isDirty && <p className="text-sm text-emerald-400">Profile updated.</p>}
                </div>
            </form>
        </Section>
    );
}

function PasswordSection() {
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {errors}
    } = useForm<PasswordForm>({
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        }
    });

    const updatePassword = useMutationApi<unknown, ApiErrors, PasswordForm>({
        url: "/profile/password",
        method: "PUT",
    });

    const onSubmit = (data: PasswordForm) => {
        setSaved(false);
        updatePassword.mutate(data, {
            onSuccess: () => {
                reset();
                setSaved(true);
            },
            onError: (error) => {
                Object.entries(error.errors).forEach(([field, message]) => {
                    setError(field as keyof PasswordForm, {message: message[0]})
                })
                if (Object.keys(error.errors).length === 0) setError("root", {message: error.message});
            }
        })
    }

    return (
        <Section title="Change password" text="Use at least 8 characters. You'll be logged out on all other devices.">
            <form onSubmit={(e) => {
                clearErrors();
                handleSubmit(onSubmit)(e);
            }} className="flex flex-1 flex-col gap-5">
                <div>
                    <Label htmlFor="current_password">Current password</Label>
                    <Input id="current_password" type="password" autoComplete="current-password"
                           className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.current_password}
                           {...register('current_password', {required: "Current password is required"})}/>
                    {errors.current_password &&
                        <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>}
                </div>

                <div>
                    <Label htmlFor="password">New password</Label>
                    <Input id="password" type="password" autoComplete="new-password" className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.password}
                           {...register('password', {
                               required: "New password is required",
                               minLength: {value: 8, message: "Password must be at least 8 characters"},
                           })}/>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <Label htmlFor="password_confirmation">Confirm new password</Label>
                    <Input id="password_confirmation" type="password" autoComplete="new-password"
                           className={`mt-2 ${authInputClass}`}
                           aria-invalid={!!errors.password_confirmation}
                           {...register('password_confirmation', {
                               required: "Please confirm your new password",
                               validate: (value, values) => value === values.password || "Passwords do not match",
                           })}/>
                    {errors.password_confirmation &&
                        <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>}
                </div>

                {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}

                <div className="mt-auto flex items-center gap-4">
                    <Button type="submit" disabled={updatePassword.isPending}
                            className="h-11 rounded-xl bg-orange-500 px-6 text-base text-black hover:bg-orange-400">
                        {updatePassword.isPending ? "Updating..." : "Update password"}
                    </Button>
                    {saved && <p className="text-sm text-emerald-400">Password updated. Other devices were logged out.</p>}
                </div>
            </form>
        </Section>
    );
}
