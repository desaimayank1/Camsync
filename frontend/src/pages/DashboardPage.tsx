import React from "react";
import CameraCard from "../components/CameraCard";
import { Button } from "@mui/material";
import { useCameraStore } from "../store/useUserStore";

const DashboardPage: React.FC = () => {
  const {cameras} =useCameraStore()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-6 py-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button variant="contained">+ Add Camera</Button>
        </div>
        <div className="flex flex-wrap gap-6 justify-start">
          {cameras.map((cam) => (
            <CameraCard key={cam.name} {...cam} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

