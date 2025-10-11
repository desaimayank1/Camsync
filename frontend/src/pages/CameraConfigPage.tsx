import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit, Delete, Videocam } from "@mui/icons-material";
import CameraForm from "../components/CameraForm";
import type { Camera } from "../types/data-types";
import { useCameraStore } from "../store/useUserStore";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CameraConfigPage: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<Camera | null>(null);

  const { cameras, updateCamera, removeCamera } = useCameraStore();

  const handleEdit = (camera: Camera) => {
    setSelectedCamera(camera);
    setOpen(true);
  };

 const handleDelete = async (id: number) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/camera/delete`, {
      params: { id },
      withCredentials: true,
    });

    if (response.data.success) {
      removeCamera(id);
    }
  } catch (error) {
    console.error("Error deleting camera:", error);
  } finally {
    setDeleteModalOpen(false);
    setCameraToDelete(null);
  }
};


  const handleSave = async () => {
    if (selectedCamera) {
      try {
        const response = await axios.patch(
          `${BACKEND_URL}/camera/update`,
          {
            name: selectedCamera.name,
            location: selectedCamera.location,
            faceDetection: selectedCamera.faceDetection,
            id: selectedCamera.id,
          },
          {
            withCredentials: true,
          }
        );

        const data = response.data;
        console.log(data);
        if (data.success) {
          updateCamera(selectedCamera);
        }
        setOpen(false);
      } catch (error) {
        console.log("error fetching user login", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Camera Configuration</h1>
        <CameraForm />

        {/* Existing Cameras */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Existing Cameras</h2>
          <div className="grid gap-4">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full">
                    <Videocam />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{camera.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span
                        className={`h-2 w-2 rounded-full ${camera.enabled ? "bg-green-500" : "bg-red-500"
                          }`}
                      ></span>
                      {camera.enabled ? "Connected" : "Offline"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(camera)} size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setCameraToDelete(camera);
                        setDeleteModalOpen(true);
                      }}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            className="absolute top-1/2 left-1/2 bg-white p-6 rounded-2xl shadow-lg w-[90%] md:w-[420px] transform -translate-x-1/2 -translate-y-1/2"
          >
            <h2 className="text-lg font-semibold mb-5 pb-2">Edit Camera</h2>

            {selectedCamera && (
              <div className="flex flex-col gap-4">
                <TextField
                  label="Camera Name"
                  value={selectedCamera.name}
                  onChange={(e) =>
                    setSelectedCamera({ ...selectedCamera, name: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Location"
                  value={selectedCamera.location || ""}
                  onChange={(e) =>
                    setSelectedCamera({
                      ...selectedCamera,
                      location: e.target.value,
                    })
                  }
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedCamera.faceDetection}
                      onChange={(e) =>
                        setSelectedCamera({
                          ...selectedCamera,
                          faceDetection: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Face Detection"
                />
                <div className="text-gray-600 bg-gray-50 rounded-md p-3">
                  <p>
                    <strong>FPS:</strong> {selectedCamera.fps || "-"}
                  </p>
                  <p className="truncate">
                    <strong>RTSP URL:</strong> {selectedCamera.rtspUrl || "-"}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outlined" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </Box>
        </Modal>

        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <Box
            className="absolute top-1/2 left-1/2 bg-white p-6 rounded-2xl shadow-lg w-[90%] md:w-[380px] transform -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <Typography variant="h6" className="!mb-3 !font-semibold">
              Confirm Deletion
            </Typography>
            <Typography className="text-gray-700 !mb-6">
              Are you sure you want to delete{" "}
              <strong>{cameraToDelete?.name}</strong>?
            </Typography>

            <div className="flex justify-center gap-4">
              <Button
                variant="outlined"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  cameraToDelete && handleDelete(cameraToDelete.id)
                }
              >
                Delete
              </Button>
            </div>
          </Box>
        </Modal>
      </main>
    </div>
  );
};

export default CameraConfigPage;
