
import React from "react";
import CameraForm from "../components/CameraForm";

const CameraConfigPage: React.FC = () => {
  const handleSaveCamera = (camera: any) => {
    console.log("Saved camera:", camera);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Camera Configuration</h1>
        <CameraForm onSave={handleSaveCamera} />
      </main>
    </div>
  );
};

export default CameraConfigPage;
