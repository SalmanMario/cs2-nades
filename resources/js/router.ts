import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
    auth: AuthContextType;
}

export const router = createRouter({
    routeTree,
    context: undefined as any as RouterContext,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
