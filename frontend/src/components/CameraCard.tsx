import React from "react";
import { Button, Alert } from "@mui/material";

interface CameraCardProps {
  name: string;
  status: "LIVE" | "OFFLINE" | "FAILED";
  lastDetected?: string;
}

const CameraCard: React.FC<CameraCardProps> = ({ name, status, lastDetected }) => {
  return (
    <div
      className={`p-4 rounded-xl shadow-md bg-white w-full md:w-[45%] lg:w-[30%] flex flex-col`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            status === "LIVE"
              ? "bg-red-100 text-red-600"
              : status === "OFFLINE"
              ? "bg-gray-100 text-gray-600"
              : "bg-pink-100 text-pink-700"
          }`}
        >
          {status}
        </span>
      </div>

      {status === "FAILED" ? (
        <Alert severity="error">
          Could not connect to the camera. Please check the connection.
        </Alert>
      ) : (
        <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
          {status === "OFFLINE" ? (
            <Button variant="contained">Start Stream</Button>
          ) : (
            <p className="text-sm text-gray-500">Face detected: {lastDetected}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraCard;
