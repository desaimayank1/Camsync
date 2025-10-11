import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CameraConfigPage from "./pages/CameraConfigPage";
import AlertPage from "./pages/AlertPage";
import MainLayout from "./MainLayout";
import SignupPage from "./pages/SignInPage";
import Protected from "./components/Protected";
import { useUserStore } from "./store/useUserStore";
import GuestRoute from "./components/GuestRoute";


const router = createBrowserRouter([
  { path: "/", element: <GuestRoute><LoginPage /></GuestRoute> },
  { path: "/signup", element: <GuestRoute><SignupPage/></GuestRoute> },
  {
    element: (
        <MainLayout />
    ),
    children: [
      { path: "/dashboard", element:<Protected><DashboardPage /></Protected>  },
      { path: "/camera", element:<Protected><CameraConfigPage /> </Protected> },
      { path: "/alert", element:<Protected><AlertPage /></Protected>  },
    ],
  },
]);

const App: React.FC = () => {
  const {fetchUser} = useUserStore()
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <RouterProvider router={router} />;
};

export default App;
