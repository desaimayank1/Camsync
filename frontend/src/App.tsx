import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CameraConfigPage from "./pages/CameraConfigPage";
import AlertPage from "./pages/AlertPage";
import MainLayout from "./MainLayout";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    element: <MainLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/camera", element: <CameraConfigPage /> },
      { path: "/alert", element: <AlertPage /> },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
