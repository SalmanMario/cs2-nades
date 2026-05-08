type AuthContext = {
    user: User|null,
    login: (data: Login) => Promise<void>,
    loadUser: () => Promise<any>,
    logout: () => Promise<void>,
}
