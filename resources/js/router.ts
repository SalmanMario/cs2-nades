// router.ts
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Definește tipul contextului
export interface RouterContext {
    auth: AuthContextType;
}

// Creează routerul cu tipul explicit
export const router = createRouter({
    routeTree,
    context: undefined as any as RouterContext,
});

// Declară interfața Register
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
