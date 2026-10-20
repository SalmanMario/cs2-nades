import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_auth')({
    beforeLoad: async ({context, location}) => {
        const auth: AuthContext = (context as { auth: AuthContext }).auth;
        const user: User | null = auth.user ?? (await auth.loadUser());

        if (!user) {
            // come back to this admin page after logging in
            throw redirect({to: "/login", search: {redirect: location.href}});
        }

        if (user.role !== "ADMIN") {
            throw redirect({to: "/"});
        }

        return {user};
    },
    component: () => <Outlet/>,
})
