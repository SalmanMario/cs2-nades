import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_auth')({
    beforeLoad: async ({context}) => {
        const auth: AuthContext = (context as { auth: AuthContext }).auth;
        const user: User | null = auth.user ?? (await auth.loadUser());

        if (!user) {
            throw redirect({to: "/admin/login"});
        }

        if (user.role !== "ADMIN") {
            throw redirect({to: "/"});
        }

        return {user};
    },
    component: () => <Outlet/>,
})
