import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useCameraStore } from "../store/useUserStore";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CameraForm: React.FC = () => {
  const [cameraName, setCameraName] = useState("");
  const [rtspUrl, setRtspUrl] = useState("");
  const [location, setLocation] = useState("");
  const {addCamera}=useCameraStore()
  const [msg ,setMsg]=useState("");
  const [error ,setError]=useState(false);

  const handleSave = async () => {
    setMsg("")
    if (cameraName && location && rtspUrl) {
      try {
        const response = await axios.post(`${BACKEND_URL}/camera/add`, {
            cameraName: cameraName,
            rtspUrl: rtspUrl,
            location:location
          }, {
          withCredentials: true,
        })

        const data = response.data;
        if (data.success) {
           addCamera(data.camera)
           setError(false)
           setCameraName("")
           setLocation("")
           setRtspUrl("")
        }else{
          setError(true)
        }
        setMsg(data.message);
      } catch (error) {
        console.log("error adding camera ", error);
      }
    }
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

      <div className="flex justify-end gap-3">
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Camera
        </Button>
      </div> 
       {msg && <span className={`${error?"text-red-600":"text-green-400"}`}>{msg}</span>}
    </div>
  );
};

export default CameraForm;
