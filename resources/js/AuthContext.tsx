import React, {createContext, useContext, useEffect, useState} from "react";
import api from "@/lib/api";

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

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

    useEffect(() => {
        loadUser().then();
    }, []);

    const login = async (data: Login) => {
        await api.get("/sanctum/csrf-cookie");
        await api.post("/login", data);
        return await loadUser();
    };

    const register = async (data: Register) => {
        await api.get("/sanctum/csrf-cookie");
        await api.post("/register", data);
        return await loadUser();
    };

    const logout = async () => {
        await api.post("/logout");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loadUser}}>
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
