import React, { useState } from "react";
import { TextField, Button, Alert } from "@mui/material";

interface CameraFormProps {
  onSave: (camera: { name: string; rtsp: string; location: string }) => void;
}

const CameraForm: React.FC<CameraFormProps> = ({ onSave }) => {
  const [cameraName, setCameraName] = useState("");
  const [rtspUrl, setRtspUrl] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(false);

  const handleSave = () => {
    if (!rtspUrl.startsWith("rtsp://")) {
      setError(true);
      return;
    }
    setError(false);
    onSave({ name: cameraName, rtsp: rtspUrl, location });
  };

  return (
    <div className="w-full bg-white shadow rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Add a new camera</h2>
      <TextField
        label="Camera Name"
        value={cameraName}
        onChange={(e) => setCameraName(e.target.value)}
        fullWidth
      />
      <TextField
        label="RTSP URL"
        value={rtspUrl}
        onChange={(e) => setRtspUrl(e.target.value)}
        fullWidth
      />
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
      />

      {error && (
        <Alert severity="error">
          Could not connect to the camera. Please check the RTSP URL and ensure
          the camera is online.
        </Alert>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Camera
        </Button>
      </div>
    </div>
  );
};

export default CameraForm;
