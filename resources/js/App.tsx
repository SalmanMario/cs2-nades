import "../css/app.css";
import {createRoot} from "react-dom/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createRouter, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "./routeTree.gen";
import {AuthProvider, useAuth} from "@/AuthContext";

const queryClient = new QueryClient();

export const router = createRouter({
    routeTree,
    context: {
        auth: undefined! as AuthContext,
        queryClient,
    }
});

function InnerApp() {
    const auth = useAuth();
    return <RouterProvider router={router} context={{auth, queryClient}}/>;
}

createRoot(document.getElementById("app")!).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <InnerApp/>
        </AuthProvider>
    </QueryClientProvider>
);

