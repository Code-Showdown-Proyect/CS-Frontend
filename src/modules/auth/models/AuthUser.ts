// AuthUser.ts

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    roles: string[];
    token: string;
}

// Función para crear un AuthUser con los datos proporcionados.
export const createAuthUser = (
    id: number,
    username: string,
    email: string,
    roles: string[],
    token: string
): AuthUser => {
    return {
        id,
        username,
        email,
        roles,
        token,
    };
};

// Ejemplo de un método para validar si el usuario tiene un rol específico.
export const userHasRole = (user: AuthUser, role: string): boolean => {
    return user.roles.includes(role);
};

// Ejemplo de un método para validar si el usuario está autenticado.
export const isAuthenticated = (user: AuthUser | null): boolean => {
    return user !== null && user.token !== "";
};