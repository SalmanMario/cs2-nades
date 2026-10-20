type AuthContext = {
    user: User|null,
    login: (data: Login) => Promise<User|null>,
    register: (data: Register) => Promise<User|null>,
    loadUser: () => Promise<any>,
    logout: () => Promise<void>,
}
