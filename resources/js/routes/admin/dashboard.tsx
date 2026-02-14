import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import React from "react";
import {useAuth} from "@/AuthContext";

export const Route = createFileRoute('/admin/dashboard')({
    beforeLoad: async ({ context }) => {
        const auth: AuthContextType = (context as {auth: AuthContextType}).auth;
        const user: LoginData = auth.user ?? (await auth.loadUser());

        if (!user) {
            throw redirect({ to: "/admin" });
        }

        return { user };
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({to: "/admin"})
    }

    return (
        <div>
            <h1>Dashboard (Admin)</h1>
            <p>ID: {user?.id}</p>
            <p>Name: {user?.name}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
