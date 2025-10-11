import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore"; 

interface UnprotectedProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: UnprotectedProps) => {
  const {user} = useUserStore()
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};


export default GuestRoute;