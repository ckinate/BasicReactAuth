import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

       if (isLoading) {
        return <div>Loading...</div>; // Or a spinner
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute