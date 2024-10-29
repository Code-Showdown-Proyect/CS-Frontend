import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Asegúrate de importar correctamente tu contexto AuthContext
import { AuthContextType } from "../types/AuthTypes";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};