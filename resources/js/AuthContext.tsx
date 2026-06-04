import React, {createContext, useContext, useState} from "react";
import api from "@/lib/api";

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);

    const loadUser = async () => {
        try {
            const res = await api.get("/api/user");
            setUser(res.data);
            return res.data;
        } catch {
            setUser(null);
            return null;
        }
    };

    const login = async (data: Login) => {
        await api.get("/sanctum/csrf-cookie");
        await api.post("/login", data);
        return await loadUser();
    };

    const logout = async () => {
        await api.post("/logout");
        setUser(null);
        window.location.href = "/admin/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loadUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
