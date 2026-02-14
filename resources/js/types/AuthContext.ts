type AuthContextType = {
    user: UserData|null,
    login: (data: LoginData) => Promise<void>,
    loadUser: () => Promise<any>,
    logout: () => Promise<void>,
}
