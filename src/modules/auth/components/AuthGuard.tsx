import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../hooks/useAuth.ts";

const AuthGuard = () => {
    const { user } = useAuth();

    // Si el usuario no está autenticado, lo redirige a la página de login
    if (!user) {
        return <Navigate to="/auth/login" />;
    }

    // Si el usuario está autenticado, muestra el contenido de la ruta
    return <Outlet />;
};

export default AuthGuard;