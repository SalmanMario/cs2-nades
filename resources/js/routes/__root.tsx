import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { pageTitle } from "@/hooks/helper";

const RootLayout = () => (
    <div>
        <HeadContent />
        <Outlet />
        <TanStackRouterDevtools />
    </div>
)

export const Route = createRootRoute({
    head: () => ({
        meta: [{ title: pageTitle() }],
    }),
    component: RootLayout,
})
