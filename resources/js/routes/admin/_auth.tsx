import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_auth')({
    beforeLoad: async ({context}) => {
        const auth: AuthContext = (context as { auth: AuthContext }).auth;
        const user: Login = auth.user ?? (await auth.loadUser());

        if (!user) {
            throw redirect({to: "/admin/login"});
        }

        return {user};
    },
    component: () => <Outlet/>,
})
