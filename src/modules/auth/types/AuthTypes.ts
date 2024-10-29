export interface User {
    token: string;
    username?: string; // Puedes agregar otras propiedades que necesites, como 'id', 'email', etc.
    id?: number;
}

export interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

// Agregar un tipo para las credenciales de login
export interface LoginCredentials {
    email: string;
    password: string;
}